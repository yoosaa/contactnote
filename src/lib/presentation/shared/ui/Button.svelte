<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'danger' | 'danger-outline' | 'ghost' | 'ghost-link';

	type Props = {
		type?: 'button' | 'submit' | 'reset';
		variant?: Variant;
		disabled?: boolean;
		form?: string;
		onclick?: () => void | Promise<void>;
		className?: string;
		children: Snippet;
	};

	let {
		type = 'button',
		variant = 'secondary',
		disabled = false,
		form,
		onclick,
		className = '',
		children
	}: Props = $props();

	const solidBaseClass =
		'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold disabled:opacity-60';

	const linkBaseClass = 'inline-flex items-center text-sm font-bold disabled:opacity-60';

	const variantClasses: Record<Variant, string> = {
		primary: 'bg-slate-950 text-white hover:bg-slate-800',
		secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
		danger: 'bg-red-700 text-white hover:bg-red-800',
		'danger-outline': 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
		ghost: 'text-slate-500 hover:text-slate-950',
		'ghost-link': 'text-slate-500 hover:text-slate-950'
	};

	const baseClass = $derived(variant === 'ghost-link' ? linkBaseClass : solidBaseClass);

	const buttonClass = $derived(`${baseClass} ${variantClasses[variant]} ${className}`);
</script>

<button class={buttonClass} {type} {disabled} {form} {onclick}>
	{@render children()}
</button>
