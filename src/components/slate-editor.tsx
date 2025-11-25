
'use client';

import React, { useCallback, useMemo } from 'react'
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Text as SlateText } from 'slate'
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'
import { Bold, Italic, Underline, Link } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type CustomElement = { type: 'paragraph' | 'link'; url?: string; children: CustomText[] }
type CustomText = { text: string; bold?: true, italic?: true, underline?: true }

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor & {
      history: {
        undos: any[],
        redos: any[],
      }
    }
    Element: CustomElement
    Text: CustomText
  }
}

interface SlateEditorProps {
    value: Descendant[];
    onChange: (value: Descendant[]) => void;
}

const toggleMark = (editor: Editor, format: 'bold' | 'italic' | 'underline') => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isMarkActive = (editor: Editor, format: 'bold' | 'italic' | 'underline') => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const Leaf = ({ attributes, children, leaf }: { attributes: any, children: any, leaf: CustomText }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }
    
    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

const Element = (props: any) => {
    const { attributes, children, element } = props;
    switch (element.type) {
        case 'link':
            return <a {...attributes} href={element.url}>{children}</a>
        case 'paragraph':
        default:
            return <p {...attributes}>{children}</p>
    }
}


const MarkButton = ({ format, icon }: { format: 'bold' | 'italic' | 'underline', icon: React.ReactNode }) => {
    const editor = useSlate()
    return (
        <Button
            variant="outline"
            size="icon"
            className={cn("h-8 w-8", {
                'bg-muted': isMarkActive(editor, format)
            })}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}

export function SlateEditor({ value, onChange }: SlateEditorProps) {
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const renderElement = useCallback((props: any) => <Element {...props} />, [])
    const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
        <div className='border rounded-md'>
            <div className='p-2 flex gap-2 border-b bg-muted/50'>
                 <MarkButton format="bold" icon={<Bold className="h-4 w-4" />} />
                 <MarkButton format="italic" icon={<Italic className="h-4 w-4" />} />
                 <MarkButton format="underline" icon={<Underline className="h-4 w-4" />} />
            </div>
            <Editable
                className="p-4 min-h-[250px] focus:outline-none"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Tell your story..."
                spellCheck
                autoFocus
            />
        </div>
    </Slate>
  )
}
