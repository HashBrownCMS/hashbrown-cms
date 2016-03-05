class Helper {
    static formatDate(input) {
        var date = new Date(input);
        var output =
            date.getFullYear() +
            '-' +
            date.getMonth() +
            '-' +
            date.getDate() +
            ' ' +
            date.getHours() +
            ':' +
            date.getMinutes() +
            ':' +
            date.getSeconds();

        return output;
    }

    static basename(path, extension) {
        var base = new String(path).substring(path.lastIndexOf('/') + 1); 
        
        if(extension) {
            base = base.replace(extension, '');
        }

        return base;
    }

    static basedir(path) {
        var base = new String(path).substring(0, path.lastIndexOf('/')); 
        
        return base;
    }

    static truncate(string, max, addDots) {
        var output = string;

        if(output.length > max) {
            output = output.substring(0, max);

            if(addDots) {
                output += '...';
            }
        }

        return output;
    }
}

window.helper = Helper;
