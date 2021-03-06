'use strict';

function saveUrl(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

const useObjectUrl = URL.createObjectURL &&
    // https://crbug.com/733304
    !/ Android 7\..* Chrome\/5[0-9]\./.test(window.navigator.userAgent);

const saveBlob = window.navigator.msSaveOrOpenBlob ? (blob, filename) => {
    window.navigator.msSaveOrOpenBlob(blob, filename);
} : useObjectUrl ? (blob, filename) => {
    const url = URL.createObjectURL(blob);
    saveUrl(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 0);
} : (blob, filename) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => saveUrl(reader.result, filename));
    reader.readAsDataURL(blob);
};

export default saveBlob;
