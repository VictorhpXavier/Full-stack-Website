//Send os to backend

(function () {
    let os = navigator.appVersion;

    fetch('/sendOs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ os: os }),
    }).then((response) => response.json());

})();

