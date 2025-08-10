'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MenuBar } from '@/components/rich-text-editor/MenuBar';
import TextAlign from '@tiptap/extension-text-align';
import { ListItem, BulletList, OrderedList } from '@tiptap/extension-list';

export function TipTapEditor({ field }: { field: any }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Tailwind removes the default styles, so we need prose class
        // to apply the correct styles for the editor content.
        class:
          'min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose ' +
          'lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none',
      },
    },

    onUpdate: ({ editor }) => {
      const content = JSON.stringify(editor.getJSON());

      field.onChange(content);
    },

    content: field.value ? JSON.parse(field.value) : '<p>Hello World</p>',
  });

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      {editor && (
        <>
          <MenuBar editor={editor} />
          <div className="max-h-[300px] overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
        </>
      )}
    </div>
  );
}
