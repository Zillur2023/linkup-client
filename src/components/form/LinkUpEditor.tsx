import "./LinkUpEditorStyles.scss";
import "./LinkUpEditorStyles.css";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@heroui/react";

interface LinkUpEditorProps {
  name: string;
  editor: Editor | null; // Editor instance or null if not yet initialized
}

const LinkUpEditor: React.FC<LinkUpEditorProps> = ({ name, editor }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  if (!editor) {
    return null;
  }
  // const handleReset = () => {
  //   if (editor) {
  //     editor.commands.setContent(""); // Reset the editor content
  //     reset({ [name]: "" }); // Reset the form state
  //   }
  // }

  return (
    <>
      <div className=" border-2 p-1 rounded-md">
        <div className="control-group">
          <div className="button-group">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              Strike
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={editor.isActive("code") ? "is-active" : ""}
            >
              Code
            </button>
            <button
              onClick={() => editor.chain().focus().unsetAllMarks().run()}
            >
              Clear marks
            </button>
            <button onClick={() => editor.chain().focus().clearNodes().run()}>
              Clear nodes
            </button>
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editor.isActive("paragraph") ? "is-active" : ""}
            >
              Paragraph
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }
            >
              H2
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive("heading", { level: 3 }) ? "is-active" : ""
              }
            >
              H3
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={
                editor.isActive("heading", { level: 4 }) ? "is-active" : ""
              }
            >
              H4
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
              className={
                editor.isActive("heading", { level: 5 }) ? "is-active" : ""
              }
            >
              H5
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 6 }).run()
              }
              className={
                editor.isActive("heading", { level: 6 }) ? "is-active" : ""
              }
            >
              H6
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              Bullet list
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "is-active" : ""}
            >
              Ordered list
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive("codeBlock") ? "is-active" : ""}
            >
              Code block
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "is-active" : ""}
            >
              Blockquote
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              Horizontal rule
            </button>
            <button onClick={() => editor.chain().focus().setHardBreak().run()}>
              Hard break
            </button>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              Undo
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              Redo
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#958DF1").run()}
              className={
                editor.isActive("textStyle", { color: "#958DF1" })
                  ? "is-active"
                  : ""
              }
            >
              Purple
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive("highlight") ? "is-active" : ""}
            >
              Highlight
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "is-active" : ""
              }
            >
              Left
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "is-active" : ""
              }
            >
              Center
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "is-active" : ""
              }
            >
              Right
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={
                editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
              }
            >
              Justify
            </button>
          </div>
        </div>
        {/* <EditorContent editor={editor} /> */}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <EditorContent
              editor={editor}
              // onBlur={() => field.onChange(editor.getHTML())}
              onBlur={() => {
                const content = editor.getHTML();
                setValue(name, content); // Final sync when editor loses focus
              }}
              className="editor-content border-2 p-2 rounded-md"
            />
          )}
        />
      </div>
      {errors[name]?.message && (
        <p className="text-red-500 text-sm mt-2">
          {errors[name]?.message as string}
        </p>
      )}
    </>
  );
};

export default LinkUpEditor;
