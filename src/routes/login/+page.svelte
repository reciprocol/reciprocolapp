<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import Link from '$lib/components/Link.svelte';
	import { getAuth } from '../Auth.svelte';
	import Note from '$lib/components/Note.svelte';
	import Feedback from '$lib/components/Feedback.svelte';
	import Form from '$lib/components/Form.svelte';
	import { goto } from '$app/navigation';

	let email = $state('');

	// function validORCID(text: string) {
	// 	return text.length === 0 || ORCIDRegex.test(text);
	// }

	let auth = getAuth();

	let error = $state<undefined | string>(undefined);
	let submitted = $state(false);
	let password = $state('');

	// When the user is authenticated, redirect to their home page.
	$effect(() => {
		if (auth.isAuthenticated()) {
			goto(`/scholar/${auth.getUserID()}`);
		}
	});
</script>

<h1>Login</h1>

{#if auth.isAuthenticated()}
	<p>You are logged in.</p>
{:else}
	<!-- <p>Login with your <Link to="https://orcid.org/">ORCID</Link> account.</p> -->

	<Feedback error
		>We're still implementing ORCID authentication. For now, enter your email for a one time
		password.</Feedback
	>

	<Form inline>
		<TextField
			label="email"
			placeholder=""
			active={!submitted}
			name="email"
			size={19}
			bind:text={email}
		/>
		<Button
			tip="Send one-time password"
			action={async () => {
				const authError = await auth.signIn(email, undefined);
				if (authError) {
					console.error(authError);
					error = 'Unable to send one-time password.';
				} else {
					error = undefined;
					submitted = true;
				}
			}}
			active={!submitted}>Login</Button
		>
	</Form>

	{#if submitted}
		<Feedback>Check your email for a sign in code.</Feedback>
		<Form inline>
			<TextField
				label="password"
				placeholder="6 digits"
				name="password"
				size={19}
				bind:text={password}
			/>
			<Button
				tip="Sign in"
				action={async () => {
					const response = await auth.signIn(email, password);
					if (typeof response === 'string') {
						error = undefined;
						submitted = false;
						goto(`/scholar/${response}`);
					} else {
						console.error(response);
						error = 'Unable to sign in.';
					}
				}}
				active={password.length > 0}>Login</Button
			>
		</Form>
	{/if}

	<Note>
		<Link to="https://orcid.org/">ORCID</Link> is the de facto way to manage scholar identity.
	</Note>
{/if}

{#if error}
	<Feedback error>{error}</Feedback>
{/if}
