var forge=require('node-forge'), assert=require('better-assert'), fs=require('fs'),
  letiny=require('../lib/client'), config=require('./config.json'),
  res, newReg='https://acme-staging.api.letsencrypt.org/acme/new-reg';

config.newReg=config.newReg || newReg;
config.pfxFile=config.pfxFile || './tmp.pfx';
config.pfxPassword=config.pfxPassword || 'passwd';

describe('config.json', function() {
  it('should contain required settings', function() {
    assert(config.email && config.email!=='me@example.com');
    assert(config.domains && config.domains!=='example.com');
    assert(config.webroot && config.webroot!=='/var/www/example.com');
    assert(config.agreeTerms===true);
  });
});

describe('getCert', function() {
  this.timeout(60000);
  it('should return cert, key and ca', function(done) {
    letiny.getCert(config, function(err, cert, key, ca) {
      if (err) {
        throw err;
      }
      assert(cert);
      assert(key);
      assert(ca);
      res={cert:cert, key:key, ca:ca};
      done();
    });
  });
});

describe('Certificate', function() {
  var cert, ms89days=89*24*60*60000;
  it('should be parsable', function() {
    cert=forge.pki.certificateFromPem(res.cert);
  });
  it('should contain correct domain name', function() {
    assert(cert.subject.getField('CN').value===config.domains);
  });
  it('should be valid at least 89 days', function() {
    assert(cert.validity.notBefore<new Date());
    assert(cert.validity.notAfter>new Date(Date.now()+ms89days));
  });
});

describe('Private key', function() {
  it('should be parsable', function() {
    forge.pki.privateKeyFromPem(res.key);
  });
});

describe('Issuer certificate', function() {
  var ca;
  it('should be parsable', function() {
    ca=forge.pki.certificateFromPem(res.ca);
  });
  it('should be valid', function() {
    assert(ca.validity.notBefore<new Date());
    assert(ca.validity.notAfter>new Date());
  });
});

describe('PKCS#12', function() {
  var pfx;
  it('should create .pfx file', function() {
    pfx=fs.readFileSync('./tmp.pfx').toString('base64');
    fs.unlinkSync('./tmp.pfx');
  });
  it('should be parsable', function() {
    var p12=forge.util.decode64(pfx);
    p12=forge.asn1.fromDer(p12);
    p12=forge.pkcs12.pkcs12FromAsn1(p12, 'passwd');
    assert(p12.safeContents.length);
  });
});

describe('challenge option', function() {
  this.timeout(40000);
  it('should provide domain and challenge path and data', function(done) {
    config.webroot=false;
    config.challenge=function(domain, path, data) {
      assert(domain===config.domains);
      assert(path.match(/^\/\.well-known\/acme-challenge\/[\w-]{43}$/));
      assert(data.length>60);
      done();
    };
    letiny.getCert(config, function() {});
  });
});

describe('Error handling', function() {
  this.timeout(40000);
  it('should call callback with err', function(done) {
    config.challenge=function(domain, path, data, cb) {
      cb();
    };
    letiny.getCert(config, function(err) {
      assert(err instanceof Error);
      done();
    });
  });
});

