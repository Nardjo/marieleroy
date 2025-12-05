<script setup lang="ts">
  import { EditorContent, useEditor } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import TextAlign from '@tiptap/extension-text-align'
  import Underline from '@tiptap/extension-underline'
  import Link from '@tiptap/extension-link'
  import { TextStyle } from '@tiptap/extension-text-style'
  import { Color } from '@tiptap/extension-color'

  const colorOptions = [
    { name: 'Primary', value: '#8b6239', class: 'bg-primary-600' },
    { name: 'Orange', value: '#ea580c', class: 'bg-orange-600' },
    { name: 'Vert', value: '#16a34a', class: 'bg-green-600' },
    { name: 'Bleu', value: '#2563eb', class: 'bg-blue-600' },
    { name: 'Rouge', value: '#dc2626', class: 'bg-red-600' },
    { name: 'Noir', value: '#1f2937', class: 'bg-gray-800' },
  ]

  interface Props {
    modelValue?: string
    placeholder?: string
    minHeight?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: 'Commencez à écrire...',
    minHeight: '200px',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const editor = useEditor({
    content: props.modelValue,
    extensions: [
      StarterKit.configure({
        history: {
          depth: 10,
        },
        gapcursor: false,
        hardBreak: {
          keepMarks: true,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary-dark cursor-pointer',
        },
      }),
      TextStyle,
      Color,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: `min-height: ${props.minHeight}; padding: 1rem;`,
      },
      handleKeyDown: (view, event) => {
        // Gérer la suppression des hard breaks avec Backspace
        if (event.key === 'Backspace') {
          const { state } = view
          const { selection } = state
          const { $from } = selection

          // Vérifier si le noeud précédent est un hard break
          if ($from.nodeBefore?.type.name === 'hardBreak') {
            view.dispatch(
              state.tr.delete($from.pos - 1, $from.pos),
            )
            return true
          }
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      emit('update:modelValue', html)
    },
  })

  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.destroy()
    }
  })

  watch(
    () => props.modelValue,
    newValue => {
      if (!editor.value) return

      try {
        const isSame = editor.value.getHTML() === newValue
        if (!isSame) {
          editor.value.commands.setContent(newValue || '', false)
        }
      } catch {
        console.error('Failed to set editor content')
      }
    },
    { flush: 'post' },
  )

  const addLink = () => {
    const url = window.prompt('URL du lien:')
    if (url && editor.value) {
      editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  const removeLink = () => {
    if (editor.value) {
      editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    }
  }

  const addLineBreak = () => {
    editor.value?.chain().focus().setHardBreak().run()
  }

  const setColor = (color: string) => {
    editor.value?.chain().focus().setColor(color).run()
  }

  const removeColor = () => {
    editor.value?.chain().focus().unsetColor().run()
  }

  const isColorDropdownOpen = ref(false)
</script>

<template>
  <div class="rich-text-editor-wrapper">
    <div v-if="editor" class="editor-toolbar">
      <div class="toolbar-group">
        <UTooltip text="Gras (Ctrl+B)">
          <UButton
            :variant="editor?.isActive('bold') ? 'solid' : 'ghost'"
            :color="editor?.isActive('bold') ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().toggleBold().run()">
            <UIcon name="i-lucide-bold" class="w-5 h-5" />
          </UButton>
        </UTooltip>
        <UTooltip text="Italique (Ctrl+I)">
          <UButton
            :variant="editor?.isActive('italic') ? 'solid' : 'ghost'"
            :color="editor?.isActive('italic') ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().toggleItalic().run()">
            <UIcon name="i-lucide-italic" class="w-5 h-5" />
          </UButton>
        </UTooltip>
        <UTooltip text="Souligné (Ctrl+U)">
          <UButton
            :variant="editor?.isActive('underline') ? 'solid' : 'ghost'"
            :color="editor?.isActive('underline') ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().toggleUnderline().run()">
            <UIcon name="i-lucide-underline" class="w-5 h-5" />
          </UButton>
        </UTooltip>
      </div>

      <div class="toolbar-group">
        <UTooltip text="Titre 2 (Ctrl+Alt+2)">
          <UButton
            :variant="editor?.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'"
            :color="editor?.isActive('heading', { level: 2 }) ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
            <UIcon name="i-lucide-heading-2" class="w-5 h-5" />
          </UButton>
        </UTooltip>
        <UTooltip text="Titre 3 (Ctrl+Alt+3)">
          <UButton
            :variant="editor?.isActive('heading', { level: 3 }) ? 'solid' : 'ghost'"
            :color="editor?.isActive('heading', { level: 3 }) ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">
            <UIcon name="i-lucide-heading-3" class="w-5 h-5" />
          </UButton>
        </UTooltip>
      </div>

      <div class="toolbar-group">
        <UTooltip text="Liste à puces">
          <UButton
            :variant="editor?.isActive('bulletList') ? 'solid' : 'ghost'"
            :color="editor?.isActive('bulletList') ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().toggleBulletList().run()">
            <UIcon name="i-lucide-list" class="w-5 h-5" />
          </UButton>
        </UTooltip>
        <UTooltip text="Liste numérotée">
          <UButton
            :variant="editor?.isActive('orderedList') ? 'solid' : 'ghost'"
            :color="editor?.isActive('orderedList') ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().toggleOrderedList().run()">
            <UIcon name="i-lucide-list-ordered" class="w-5 h-5" />
          </UButton>
        </UTooltip>
      </div>

      <div class="toolbar-group">
        <UTooltip text="Aligner à gauche">
          <UButton
            :variant="editor?.isActive({ textAlign: 'left' }) ? 'solid' : 'ghost'"
            :color="editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().setTextAlign('left').run()">
            <UIcon name="i-lucide-align-left" class="w-5 h-5" />
          </UButton>
        </UTooltip>
        <UTooltip text="Centrer le texte">
          <UButton
            :variant="editor?.isActive({ textAlign: 'center' }) ? 'solid' : 'ghost'"
            :color="editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().setTextAlign('center').run()">
            <UIcon name="i-lucide-align-center" class="w-5 h-5" />
          </UButton>
        </UTooltip>
        <UTooltip text="Aligner à droite">
          <UButton
            :variant="editor?.isActive({ textAlign: 'right' }) ? 'solid' : 'ghost'"
            :color="editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'neutral'"
            size="md"
            square
            @click="editor?.chain().focus().setTextAlign('right').run()">
            <UIcon name="i-lucide-align-right" class="w-5 h-5" />
          </UButton>
        </UTooltip>
      </div>

      <div class="toolbar-group">
        <UTooltip text="Ajouter un lien (Ctrl+K)">
          <UButton
            :variant="editor?.isActive('link') ? 'solid' : 'ghost'"
            :color="editor?.isActive('link') ? 'primary' : 'neutral'"
            size="md"
            square
            @click="addLink">
            <UIcon name="i-lucide-link" class="w-5 h-5" />
          </UButton>
        </UTooltip>
        <UTooltip text="Supprimer le lien">
          <UButton
            :disabled="!editor?.isActive('link')"
            variant="ghost"
            color="error"
            size="md"
            square
            @click="removeLink">
            <UIcon name="i-lucide-link-2-off" class="w-5 h-5" />
          </UButton>
        </UTooltip>
        <UTooltip text="Saut de ligne (Shift+Enter)">
          <UButton variant="ghost" color="neutral" size="md" square @click="addLineBreak">
            <UIcon name="i-lucide-corner-down-left" class="w-5 h-5" />
          </UButton>
        </UTooltip>
      </div>

      <div class="toolbar-group">
        <UPopover v-model:open="isColorDropdownOpen">
          <UTooltip text="Couleur du texte">
            <UButton variant="ghost" color="neutral" size="md" square>
              <UIcon name="i-lucide-palette" class="w-5 h-5" />
            </UButton>
          </UTooltip>
          <template #content>
            <div class="p-2">
              <div class="grid grid-cols-3 gap-2 mb-2">
                <button
                  v-for="color in colorOptions"
                  :key="color.value"
                  :title="color.name"
                  class="w-8 h-8 rounded-md border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  :style="{ backgroundColor: color.value }"
                  @click="setColor(color.value); isColorDropdownOpen = false" />
              </div>
              <UButton
                variant="ghost"
                color="neutral"
                size="sm"
                class="w-full"
                @click="removeColor(); isColorDropdownOpen = false">
                <UIcon name="i-lucide-x" class="w-4 h-4 mr-1" />
                Supprimer la couleur
              </UButton>
            </div>
          </template>
        </UPopover>
      </div>

      <div class="toolbar-group">
        <UTooltip text="Annuler (Ctrl+Z)">
          <UButton
            :disabled="!editor?.can().undo()"
            variant="ghost"
            color="neutral"
            size="md"
            square
            @click="editor?.chain().focus().undo().run()">
            <UIcon name="i-lucide-undo" class="w-5 h-5" />
          </UButton>
        </UTooltip>
        <UTooltip text="Rétablir (Ctrl+Y)">
          <UButton
            :disabled="!editor?.can().redo()"
            variant="ghost"
            color="neutral"
            size="md"
            square
            @click="editor?.chain().focus().redo().run()">
            <UIcon name="i-lucide-redo" class="w-5 h-5" />
          </UButton>
        </UTooltip>
      </div>
    </div>

    <EditorContent :editor="editor || undefined" class="rich-text-editor" />

    <div v-if="!editor" class="rich-text-editor-loading">
      <div class="p-4 text-gray-500">Chargement de l'éditeur...</div>
    </div>
  </div>
</template>

<style scoped>
  .rich-text-editor-wrapper {
    border: 1px solid rgb(229 231 235);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  :is(.dark .rich-text-editor-wrapper) {
    border-color: rgb(55 65 81);
  }

  .editor-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
    padding: var(--spacing-3);
    border-bottom: 1px solid var(--color-gray-200);
    background-color: var(--color-gray-50);
  }

  :is(.dark .editor-toolbar) {
    border-bottom-color: var(--color-gray-700);
    background-color: var(--color-gray-800);
  }

  .toolbar-group {
    display: flex;
    gap: var(--spacing-2);
  }

  .rich-text-editor {
    background-color: var(--color-background);
    min-height: 200px;
  }

  .rich-text-editor :deep(.ProseMirror) {
    padding: 1rem;
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
    color: var(--color-gray-700);
    outline: none;
    background-color: var(--color-background);
    cursor: text;
  }

  :is(.dark .rich-text-editor :deep(.ProseMirror)) {
    color: var(--color-gray-300);
    background-color: var(--color-background);
  }

  .rich-text-editor :deep(.ProseMirror p) {
    margin-bottom: var(--spacing-3);
  }

  .rich-text-editor :deep(.ProseMirror h2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: var(--spacing-3);
    margin-top: var(--spacing-4);
  }

  .rich-text-editor :deep(.ProseMirror h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-2);
    margin-top: var(--spacing-3);
  }

  .rich-text-editor :deep(.ProseMirror ul) {
    list-style-type: disc;
    padding-left: var(--spacing-5);
    margin-bottom: var(--spacing-3);
  }

  .rich-text-editor :deep(.ProseMirror ol) {
    list-style-type: decimal;
    padding-left: var(--spacing-5);
    margin-bottom: var(--spacing-3);
  }

  .rich-text-editor :deep(.ProseMirror li) {
    margin-bottom: var(--spacing-1);
  }

  .rich-text-editor :deep(.ProseMirror strong) {
    font-weight: bold;
  }

  .rich-text-editor :deep(.ProseMirror em) {
    font-style: italic;
  }

  .rich-text-editor :deep(.ProseMirror u) {
    text-decoration: underline;
  }

  .rich-text-editor :deep(.ProseMirror a) {
    color: var(--color-primary-600);
    text-decoration: underline;
    cursor: pointer;
  }

  .rich-text-editor :deep(.ProseMirror a:hover) {
    color: var(--color-primary-700);
  }

  .rich-text-editor :deep(.ProseMirror br) {
    display: block;
    content: '';
    height: 0.5em;
  }

  /* Hard break (Shift+Enter) - visible line break */
  .rich-text-editor :deep(.ProseMirror br.ProseMirror-trailingBreak) {
    display: none;
  }

  .rich-text-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) {
    color: var(--color-gray-400);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  :is(.dark .rich-text-editor :deep(.ProseMirror p.is-editor-empty:first-child::before)) {
    color: var(--color-gray-600);
  }

  .rich-text-editor-loading {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-background);
  }
</style>
