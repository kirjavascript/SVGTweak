var editor = ace.edit("editor");

export default function() {
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

export function write(str, mode='html') {
    editor.getSession().setMode("ace/mode/"+mode)
    editor.setValue(str);
}