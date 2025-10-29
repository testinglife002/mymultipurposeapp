// src/appcomponents/EditorContext.jsx
// src/appcomponents/EditorContext.jsx
// src/appcomponents/EditorContext.jsx
import { createContext, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import Alert from "editorjs-alert";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Underline from "@editorjs/underline";
import ChangeCase from "editorjs-change-case";
import Strikethrough from "@sotaproject/strikethrough";
import Checklist from "@editorjs/checklist";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import ColorPlugin from "editorjs-text-color-plugin";
import AlignmentBlockTune from "editorjs-text-alignment-blocktune";
import ImageTool from "@editorjs/image";
import AttachesTool from "@editorjs/attaches";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import LinkTool from "@editorjs/link";
import newRequest from "../../../api/newRequest";


export const EditorContext = createContext();


function EditorContextProvider({ children }) {
  const editorInstanceRef = useRef(null);

  const initEditor = (holderId = "editorjs", data = { blocks: [] }) => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.destroy();
      editorInstanceRef.current = null;
    }

    const editor = new EditorJS({
      holder: holderId,
      placeholder: "Let's take a note!",
      autofocus: true,
      data,
      tools: {
        textAlignment: {
          class: AlignmentBlockTune,
          config: {
            default: "left",
            blocks: { header: "center" },
          },
        },

        paragraph: {
          class: Paragraph,
          inlineToolbar: [
            "bold",
            "italic",
            "underline",
            "Marker",
            "link", // 👈 Add visible inline link icon here
            "inlineCode",
          ],
          tunes: ["textAlignment"],
        },

        header: {
          class: Header,
          inlineToolbar: ["link", "Marker", "bold", "italic"],
          tunes: ["textAlignment"],
          config: {
            placeholder: "Enter a Header",
            levels: [1, 2, 3, 4, 5],
            defaultLevel: 2,
          },
        },

        alert: {
          class: Alert,
          config: { defaultType: "primary", messagePlaceholder: "Enter something" },
        },

        list: { class: List, config: { defaultStyle: "unordered" } },
        checklist: { class: Checklist },

        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                try {
                  const formData = new FormData();
                  formData.append("image", file);
                  const res = await newRequest.post("/notes/upload-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });
                  return res.data;
                } catch (err) {
                  console.error("Image upload failed", err);
                  return { success: 0 };
                }
              },
              async uploadByUrl(url) {
                return { success: 1, file: { url } };
              },
            },
          },
        },

        attaches: {
          class: AttachesTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                try {
                  const formData = new FormData();
                  formData.append("file", file);
                  const res = await newRequest.post("/notes/upload-file", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });
                  return res.data;
                } catch (err) {
                  console.error("File upload failed", err);
                  return { success: 0 };
                }
              },
            },
          },
        },

        embed: { class: Embed, config: { services: { youtube: true, codepen: true } } },
        underline: { class: Underline },
        strikethrough: { class: Strikethrough },
        Marker: { class: Marker },
        inlineCode: { class: InlineCode },
        changeCase: { class: ChangeCase },

        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote author",
          },
        },

        code: {
          class: CodeTool,
          inlineToolbar: true,
        },

        linkTool: {
          class: LinkTool,
          config: {
            async fetch(url) {
              try {
                const response = await newRequest.post("/notes/fetch-url", { url });
                return response.data;
              } catch (error) {
                console.error("LinkTool fetch error:", error);
                return { success: 0 };
              }
            },
          },
        },


        Color: {
          class: ColorPlugin,
          config: {
            colorCollections: [
              "#EC7878",
              "#9C27B0",
              "#673AB7",
              "#3F51B5",
              "#0070FF",
              "#03A9F4",
              "#00BCD4",
              "#4CAF50",
              "#8BC34A",
              "#CDDC39",
              "#FFF",
            ],
            defaultColor: "#FF1300",
            customPicker: true,
          },
        },
      },
    });

    editorInstanceRef.current = editor;
  };

  return (
    <EditorContext.Provider value={{ initEditor, editorInstanceRef }}>
      {children}
    </EditorContext.Provider>
  );
}

export default EditorContextProvider;


