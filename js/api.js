function appropriateIssue(issue) {
    // Updating issue milestones requires a number only
    if(issue.milestone) {
        issue.milestone = issue.milestone.number;
    }
    
    // Updating issue assignees requires a login name only
    if(issue.assignee) {
        issue.assignee = issue.assignee.login;
    }
    
    // Updating issue labels requires a string only
    if(issue.labels) {
        for(let i in issue.labels) {
            issue.labels[i] = issue.labels[i].name;
        }
    }

    return issue;
}

window.api = {
    call(url, callback, data) {
        data = data || {};
        
        data.token = localStorage.getItem('api-token');

        $.post(url, data, function(res) {
            if(res.err) {
                console.log(res.err, res.data);

                if(res.err.json) {
                    alert('(' + res.mode + ') ' + res.url + ': ' + res.err.json.message);
                }

            } else if(callback) {
                callback(res);
            
            }
        });
    },

    /**
     * Issue tracking
     */    
    issues: {
        fetch: function(callback) {
            api.call('/api/issue-tracking/issues/fetch/' + req.params.user + '/' + req.params.repo, callback);
        },
        
        create: function(data, callback) {
            api.call('/api/issue-tracking/issues/create/' + req.params.user + '/' + req.params.repo, callback, appropriateIssue(data));
        },
        
        update: function(data, callback) {
            api.call('/api/issue-tracking/issues/update/' + req.params.user + '/' + req.params.repo, callback, appropriateIssue(data));
        }
    },

    labels: {
        fetch: function(callback) {
            api.call('/api/issue-tracking/labels/fetch/' + req.params.user + '/' + req.params.repo, callback);
        },

        create: function(data, callback) {
            api.call('/api/issue-tracking/labels/create/' + req.params.user + '/' + req.params.repo, callback, data);
        }
    },
    
    issueColumns: function(callback) {
        env.get(function(json) {
            var columns = json.putaitu.issues.columns;

            columns.unshift('backlog');
            columns.push('done');
                
            callback(columns);
        });
    },

    milestones: {
        fetch: function(callback) {
            api.call('/api/issue-tracking/milestones/fetch/' + req.params.user + '/' + req.params.repo, callback);
        }
    },

    /**
     * Organisations
     */
    collaborators: {
        fetch: function(callback) {
            api.call('/api/collaborators/fetch/' + req.params.user + '/' + req.params.repo, callback);
        }
    },

    /** 
     * Git
     */
    repo: function(callback) {
        api.call('/api/git/repo/' + req.params.user + '/' + req.params.repo, callback);
    },

    branches: {
        get: function(callback) {
            api.call('/api/git/branches/' + req.params.user + '/' + req.params.repo, function(branches) {
                branches.sort(function(a, b) {
                    if (a.name < b.name) {
                        return -1;
                    } else if (a.name > b.name) {
                        return 1;
                    } else {
                        return 0;   
                    }
                });

                callback(branches);
            });
        }
    },

    file: {
        fetch: function(path, callback) {
            api.call('/api/git/file/fetch/' + req.params.user + '/' + req.params.repo + '/' + path, function(contents) {
                callback(atob(contents.content), contents.sha)
            });
        },
        
        update: function(data, path, callback) {
            api.call('/api/git/file/update/' + req.params.user + '/' + req.params.repo + '/' + path, callback, data);
        },
    
        create: function(data, path, callback) {
            api.call('/api/git/file/create/' + req.params.user + '/' + req.params.repo + '/' + path, callback, data);
        }
    },

    tree: {
        fetch: function(callback) {
            api.call('/api/git/tree/fetch/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch, callback);
        }
    },
    
    repos: function(callback) {
        api.call('/api/git/repos/' + req.params.user, callback);
    },

    compare: function(base, head, callback) {
        api.call('/api/git/compare/' + req.params.user + '/' + req.params.repo + '/' + base + '/' + head, callback);
    },

    merge: function(base, head, callback) {
        api.call('/api/git/merge/' + req.params.user + '/' + req.params.repo, callback, { base: base, head: head });
    },
    

    /** 
     * Abstract CMS
     */
    structs: {
        pages: {
            fetch: function(path, callback) {
                api.call('/api/structs/fetch/' + req.params.user + '/' + req.params.repo + '/pages/' + path, callback);
            }
        },
        
        sections: {
            fetch: function(path, callback) {
                api.call('/api/structs/fetch/' + req.params.user + '/' + req.params.repo + '/sections/' + path, callback);
            }
        },
        
        blocks: {
            fetch: function(path, callback) {
                api.call('/api/structs/fetch/' + req.params.user + '/' + req.params.repo + '/blocks/' + path, callback);
            }
        },

        fields: {
            fetch: function(callback) {
                api.call('/api/structs/fetch/' + req.params.user + '/' + req.params.repo + '/fields', callback);
            }
        }
    },

    templates: {
        pages: {
            fetch: function(path, callback) {
                api.call('/api/templates/fetch/' + req.params.user + '/' + req.params.repo + '/pages/' + path, callback);
            }
        },
        
        sections: {
            fetch: function(path, callback) {
                api.call('/api/templates/fetch/' + req.params.user + '/' + req.params.repo + '/blocks/' + path, callback);
            }
        },
        
        blocks: {
            fetch: function(path, callback) {
                api.call('/api/templates/fetch/' + req.params.user + '/' + req.params.repo + '/blocks/' + path, callback);
            }
        }
    },

    content: {
        fetch: function(path, callback) {
            api.call('/api/content/fetch/' + req.params.user + '/' + req.params.repo + '/' + path, callback);
        },

        publish: function(json, path, callback) {
            api.content.bake(json, function(baked) {
                let data = {
                    content: btoa(baked),
                    message: 'Published content'
                };

                api.call('/api/content/publish/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/' + path, callback, data);
            });
        },

        save: function(json, path, callback) {
            api.file.create(JSON.stringify(json), '/_content/' + path + '.json', callback);
        },

        bake: function(page, callback) {
            function bakeProperty(prop) {
                let type = Object.prototype.toString.call(prop);
                let baked = '';

                if(type === '[object Array]') {
                    baked = [];

                    for(let i in prop) {
                        baked.push(bakeProperty(prop[i]));
                    }
                
                } else if(prop.value) {
                    baked = prop.value;
                
                }

                return baked;
            }

            function bakeProperties(json) {
                let baked = {};

                for(let k in json) {
                    let prop = json[k];

                    baked[k] = bakeProperty(prop);
                }   

                return baked;
            }
            
            let baked = bakeProperties(page);

            api.call('/api/content/bake', callback, baked);
        }
    }
};
