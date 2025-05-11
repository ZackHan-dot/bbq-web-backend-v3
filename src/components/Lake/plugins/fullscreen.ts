import { Editor } from "lakelib";
const fullscreen = (editor: Editor) => {
  editor.command.add("fullscreen", {
    execute: () => {
      const editorOuter = document.getElementById("my-editor") as HTMLElement;
      const isFull = editorOuter.classList.contains("editor-full");
      if (!isFull) {
        editorOuter.classList.add("editor-full");
      } else {
        editorOuter.classList.remove("editor-full");
      }
    }
  });
};

Editor.plugin.add("fullscreen", fullscreen);
