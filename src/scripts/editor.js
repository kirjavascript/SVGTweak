export default function() {
    var editor = ace.edit("editor");
        editor.getSession().setUseWorker(false);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/html");
        editor.setOptions({fontSize: "12pt", wrap: true});
        editor.$blockScrolling = Infinity;
        //input.getSession().on('change', parse);
}

export function read() {
    return ace.edit("editor").getValue();
}

export function write(str) {
    ace.edit("editor").setValue(str);
}