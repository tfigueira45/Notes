const container = document.querySelector('.editor')

const editor = new Quill(container, {
    debug: "info",
    modules: {
      toolbar: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        [{ list: "ordered" }, { list: "bullet" }],
        ['link'],
      ]
    },
    readOnly: false,
    placeholder: "Comece a digitar...",
    theme: "snow",
})