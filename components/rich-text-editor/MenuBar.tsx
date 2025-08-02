import React from "react";
import type {Editor} from "@tiptap/react";
import {useEditorState} from "@tiptap/react";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import {Toggle} from "@/components/ui/toggle";
import {Button} from "@/components/ui/button";

import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    ListIcon,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo,
    Redo,
} from "lucide-react";
import {cn} from "@/lib/utils";

interface Props {
    editor: Editor;
}

export function MenuBar({editor}: Props) {

    // useEditorState to subscribe to editor updates
    const state = useEditorState({
        editor,
        selector: ({editor}) => ({
            isBold: editor.isActive("bold"),
            isItalic: editor.isActive("italic"),
            isStrike: editor.isActive("strike"),
            isH1: editor.isActive("heading", {level: 1}),
            isH2: editor.isActive("heading", {level: 2}),
            isH3: editor.isActive("heading", {level: 3}),
            isBulletList: editor.isActive("bulletList"),
            isOrderedList: editor.isActive("orderedList"),
            isAlignLeft: editor.isActive({textAlign: "left"}),
            isAlignCenter: editor.isActive({textAlign: "center"}),
            isAlignRight: editor.isActive({textAlign: "right"}),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
        }),
    });

    // Force re-render on selection change so alignment is always in sync.
    // Tiptap does emit selectionUpdate events but isActive('textAlign') sometimes lags without it. :contentReference[oaicite:1]{index=1}
    const [, force] = React.useReducer((x) => x + 1, 0);
    React.useEffect(() => {
        editor.on("selectionUpdate", force);
        return () => void editor.off("selectionUpdate", force);
    }, [editor]);

    if (!editor) return null;


    const formattingButtons = [
        {
            label: "Bold",
            icon: <Bold/>,
            active: state.isBold,
            onClick: () => editor.chain().focus().toggleBold().run(),
        },
        {
            label: "Italic",
            icon: <Italic/>,
            active: state.isItalic,
            onClick: () => editor.chain().focus().toggleItalic().run(),
        },
        {
            label: "Strike",
            icon: <Strikethrough/>,
            active: state.isStrike,
            onClick: () => editor.chain().focus().toggleStrike().run(),
        },
        {
            label: "H1",
            icon: <Heading1/>,
            active: state.isH1,
            onClick: () => editor.chain().focus().toggleHeading({level: 1}).run(),
        },
        {
            label: "H2",
            icon: <Heading2/>,
            active: state.isH2,
            onClick: () => editor.chain().focus().toggleHeading({level: 2}).run(),
        },
        {
            label: "H3",
            icon: <Heading3/>,
            active: state.isH3,
            onClick: () => editor.chain().focus().toggleHeading({level: 3}).run(),
        },
        {
            label: "• Bullet List",
            icon: <ListIcon/>,
            active: state.isBulletList,
            onClick: () =>
                editor.chain().focus().toggleList("bulletList", "listItem").run(),
        },
        {
            label: "1. Ordered List",
            icon: <ListOrdered/>,
            active: state.isOrderedList,
            onClick: () =>
                editor.chain().focus().toggleList("orderedList", "listItem").run(),
        },
    ];

    const alignGroups = [
        {
            label: "Align Left",
            icon: <AlignLeft/>,
            active: state.isAlignLeft,
            action: () => editor.chain().focus().setTextAlign("left").run(),
        },
        {
            label: "Align Center",
            icon: <AlignCenter/>,
            active: state.isAlignCenter,
            action: () => editor.chain().focus().setTextAlign("center").run(),
        },
        {
            label: "Align Right",
            icon: <AlignRight/>,
            active: state.isAlignRight,
            action: () => editor.chain().focus().setTextAlign("right").run(),
        },
    ];

    return (
        <div
            className={cn(
                "border border-input border-t-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center"
            )}
        >
            <TooltipProvider>
                {/* Formatting buttons */}
                <div className="flex flex-wrap gap-1">
                    {formattingButtons.map((btn) => (
                        <Tooltip key={btn.label}>
                            <TooltipTrigger asChild>
                                <Toggle
                                    size="sm"
                                    pressed={btn.active}
                                    onPressedChange={btn.onClick}
                                    className={cn(btn.active && "bg-muted text-muted-foreground")}
                                >
                                    {btn.icon}
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">{btn.label}</TooltipContent>
                        </Tooltip>
                    ))}
                </div>

                <div className="w-px h-6 bg-border mx-2"/>

                {/* Alignment buttons */}
                <div className="flex flex-wrap gap-1">
                    {alignGroups.map((btn) => (
                        <Tooltip key={btn.label}>
                            <TooltipTrigger asChild>
                                <Toggle
                                    size="sm"
                                    pressed={btn.active}
                                    onPressedChange={btn.action}
                                    className={cn(btn.active && "bg-muted text-muted-foreground")}
                                >
                                    {btn.icon}
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">{btn.label}</TooltipContent>
                        </Tooltip>
                    ))}
                </div>

                <div className="w-px h-6 bg-border mx-2"/>

                {/* Undo / Redo */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!state.canUndo}
                                type="button"
                            >
                                <Undo/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Undo</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!state.canRedo}
                                type="button"
                            >
                                <Redo/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Redo</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}
