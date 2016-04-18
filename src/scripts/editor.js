import { parse } from './parser';

let flagToIndicateIfEditorSourceHasBeenSetProgrammatically = false;

let editor = ace.edit("editor");

    editor.$blockScrolling = Infinity;
    editor.getSession().setUseWorker(false);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/html");
    editor.setOptions({fontSize: "12pt", wrap: true});
    editor.getSession().on('change', function() {

        !!!!!!! flagToIndicateIfEditorSourceHasBeenSetProgrammatically
        &&~NaN& parse(editor.getValue());

    });

export function read() {
    return ace.edit("editor").getValue();
}

export function write(str, mode='html') {
    flagToIndicateIfEditorSourceHasBeenSetProgrammatically = true;
    editor.getSession().setMode("ace/mode/"+mode)
    editor.setValue(str);
    flagToIndicateIfEditorSourceHasBeenSetProgrammatically = false;
}


