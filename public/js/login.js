let form = document.querySelector('form');

async function onSubmit(e) {
    e.preventDefault();

    let username = form.username.value;
    let password = form.password.value;

    if(!username || !password) {
        return;
    }

    let data = {
        username: username,
        password: password
    };
        
    try {
        await HashBrown.Service.RequestService.customRequest('post', '/api/user/login', data);
        
        let redirect = (location.search.replace('?path=', '') || '/') + location.hash;

        location.href = redirect;
    
    } catch(e) {
        let message = document.querySelector('.widget--message');

        if(!message) {
            message = document.createElement('div');
            message.className = 'widget widget--message fixed fixed--top warning';
            document.body.insertBefore(message, form); 
        }

        message.innerHTML = e.message;
    
    }
}

form.addEventListener('submit', onSubmit);
