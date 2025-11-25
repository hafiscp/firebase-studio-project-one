
'use client';

import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const QuillNoSSR = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function QuillEditor({ value, onChange }: QuillEditorProps) {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'link',
    ];
  return (
    <div className="bg-background">
      <QuillNoSSR
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
