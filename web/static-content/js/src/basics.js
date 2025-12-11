
const getModalDialog = () => {
    return document.querySelector("dialog");
}

const openModalDialog = (url, action) => {
    let modalDialog = getModalDialog();
    fetch(url, {
        method: 'GET'
    }).then(
        response => response.text()
    ).then(text => {
        if (text && text !== '') {
            modalDialog.innerHTML = text;
            modalDialog.showModal();
            if (action){
                action();
            }
        }
    });
    return false;
}

const openModalDialogForHtml = (url, json) => {
    let modalDialog = getModalDialog();
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json)
    }).then(
        response => response.text()
    ).then(text => {
        if (text && text !== '') {
            modalDialog.innerHTML = text;
            modalDialog.showModal();
        }
    });
    return false;
}

const closeModalDialog = () => {
    let modalDialog = getModalDialog();
    modalDialog.innerHTML = '';
    modalDialog.close();
    return false;
}

const postForHtml = (url, target) => {
    fetch(url, {
        method: 'POST'
    }).then(
        response => response.text()
    ).then(text => {
        target.innerHTML = text;
    });
}

const getFormDataFromForm = (form) => {
    let formData = new FormData();
    let hasFiles = false;
    for (const field of form.elements) {
        if (field.name) {
            if (field.type === 'file') {
                console.log("adding files: " + field.files.length);
                for (i=0; i<field.files.length;i++) {
                    let file = field.files[i];
                    console.log("adding file");
                    formData.append(field.name, file);
                    hasFiles = true;
                }
            } else {
                formData.append(field.name, field.value);
            }
        }
    }
    if (!hasFiles){
        return null;
    }
    for (let p of formData) {
        let name = p[0];
        let value = p[1];
        console.log(name, value)
    }
    return formData;
}

const postFormAsData = (url, formId) => {
    const form = document.getElementById(formId);
    let formData = getFormDataFromForm(form);
    if (formData) {
        return postFormData(url, formData);
    }
    return false;
}

const postFormData = (url, formData) => {
    fetch(url, {
        method: 'POST',
        body: formData
    });
}

const postFormAsDataForHtml = (url, formId, target) => {
    const form = document.getElementById(formId);
    let formData = getFormDataFromForm(form);
    if (formData) {
        return postFormDataForHtml(url, formData, target);
    }
    return false;
}

const postFormDataForHtml = (url, formData, target) => {
    fetch(url, {
        method: 'POST',
        body: formData
    }).then(
        response => response.text()
    ).then(text => {
        target.innerHTML = text;
    });
}

const getJsonFromForm = (form) => {
    let json = {};
    for (const field of form.elements) {
        if (field.name) {
            json[field.name] = field.value;
        }
    }
    return json;
}

const postFormAsJson = (url, formId) => {
    const form = document.getElementById(formId);
    let json =getJsonFromForm(form);
    return postJson(url, json);
}

const postJson = (url, json) => {
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json)
    });
}

const postFormAsJsonForHtml = (url, formId, target) => {
    const form = document.getElementById(formId);
    let json = getJsonFromForm(form);
    return postJsonForHtml(url, json, target);
}

const postJsonForHtml = (url, json, target) => {
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json)
    }).then(
        response => response.text()
    ).then(text => {
        target.innerHTML = text;
    });
}

const linkTo = (url) => {
    window.location.href = url;
}

const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const clearCookie = (cname) =>{
    setCookie(cname, '', 0);
}

const getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
