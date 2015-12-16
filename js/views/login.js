require('../client');

class Login extends View {
    constructor(args) {
        super(args);

        // Register events
        this.on('submit', this.onSubmit);
        this.on('clickEnter', this.onClickEnter);

        this.init();
    }

    onClickEnter() {
        let sel = $('.panel-body select');

        location = '/repos/' + sel.val();
    }
    
    onSubmit(e, element, view) {
        e.preventDefault();

        let data = $(element).serialize();

        $('.credentials .btn').toggleClass('disabled', true).val('Loading...');

        $.post('/api/login/', data, function(res) {
            if(res.err) {
                alert(res.err.json.message);
                $('.credentials .btn').toggleClass('disabled', false).val('Login');
            
            } else {
                $.post('/api/orgs/', data, function(orgs) {
                    $('.credentials').toggleClass('hidden', true);
                    $('.organization').toggleClass('hidden', false);

                    localStorage.setItem('api-token', res.token);

                    $('.organization select').html(
                        _.each(
                            orgs,
                            function(i, org) {
                                return _.option({value: org.login}, org.login);
                            }
                        )
                    );
                });
            } 
        });
    }

    render() {
        $('.page-content').html(
            _.div({class: 'container'}, [
                this.$credentials = _.div({class: 'panel panel-primary credentials'}, [
                    _.div({class: 'panel-heading'},
                        _.h4({class: 'panel-title'},
                            'Putaitu CMS: Login'
                        )
                    ),
                    _.div({class: 'panel-body'},
                        _.form({action: req.query.sender || '/repos/'}, [
                            _.input({class: 'form-control', name: 'username', required: true, type: 'text', placeholder: 'Username'}),
                            _.input({class: 'form-control', name: 'password', required: true, type: 'password', placeholder: 'Password'}),
                            _.input({class: 'form-control btn btn-primary', type: 'submit', value: 'Login'})
                        ]).on('submit', this.events.submit)
                    )
                ]),
                this.$organization = _.div({class: 'panel panel-primary organization hidden'}, [
                    _.div({class: 'panel-heading'},
                        _.h4({class: 'panel-title'},
                            'Putaitu CMS: Pick organisation'
                        )
                    ),
                    _.div({class: 'panel-body'}, [
                        _.select({class: 'form-control'}),
                        _.button({class: 'btn btn-primary form-control'},
                            'Enter'
                        ).click(this.events.clickEnter)
                    ])
                ]),
            ])
        );
    }
}

new Login();
