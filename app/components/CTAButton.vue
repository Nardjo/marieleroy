<script setup lang="ts">
  interface Props {
    text: string
    icon?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    disabled?: boolean
    fullWidth?: boolean
    to?: string
    external?: boolean
    target?: '_blank' | '_self' | '_parent' | '_top'
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'lg',
    variant: 'primary',
    disabled: false,
    fullWidth: false,
    external: false,
    target: '_blank',
    icon: undefined,
    to: undefined,
  })

  const emit = defineEmits<{
    click: []
  }>()

  const handleClick = () => {
    if (props.disabled) return
    if (!props.to) {
      emit('click')
    }
  }

  const buttonClasses = computed(() => {
    const baseClasses =
      'font-bold rounded-full transition-all duration-400 transform hover:-translate-y-1 cursor-pointer shadow-lg hover:shadow-xl'

    const sizeClasses = {
      xs: 'py-2 px-4 text-sm',
      sm: 'py-2 px-6 text-sm',
      md: 'py-3 px-6 text-base',
      lg: 'py-4 px-8 text-lg',
      xl: 'py-5 px-10 text-xl',
    }

    const variantClasses = {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white',
      secondary:
        'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white',
      outline: 'border-2 border-primary-600 text-primary-900 hover:bg-primary-600 hover:text-white bg-transparent',
      ghost: 'text-primary-900 hover:bg-primary-100',
    }

    const widthClasses = props.fullWidth ? 'w-full' : ''
    const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed hover:transform-none' : ''

    return [baseClasses, sizeClasses[props.size], variantClasses[props.variant], widthClasses, disabledClasses]
      .filter(Boolean)
      .join(' ')
  })

  const buttonProps = computed(() => {
    return {
      class: buttonClasses.value,
      disabled: props.disabled,
      ...(props.to && { to: props.to }),
      ...(props.external && { target: props.target, external: true }),
      onClick: handleClick,
    }
  })
</script>

<template>
  <UButton v-bind="buttonProps">
    <Icon v-if="icon" :name="icon" class="mr-2" />
    {{ text }}
  </UButton>
</template>
