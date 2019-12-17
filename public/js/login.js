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
        
        location.reload();
    
    } catch(e) {
        let message = document.querySelector('.widget--message');

        if(!message) {
            message = document.createElement('div');
            message.className = 'widget widget--message fixed fixed--top warn';
            document.body.insertBefore(message, form); 
        }

        message.innerHTML = e.message;
    
    }
}

form.addEventListener('submit', onSubmit);
