import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase } = await parent();

	const { data: currency, error: currencyError } = await supabase
		.from('currencies')
		.select()
		.eq('id', params.id)
		.single();
	if (currencyError) console.log(currencyError.message);

	const { data: venues, error: venuesError } = await supabase
		.from('venues')
		.select()
		.eq('currency', params.id);
	if (venuesError) console.log(venuesError.message);

	const { data: tokens, error: tokensError } = await supabase
		.from('tokens')
		.select()
		.eq('currency', params.id);
	if (tokensError) console.log(tokensError.message);

	// How many tokens?
	const count = tokens?.length ?? null;

	return {
		currency: currency,
		venues: venues,
		count: count
	};
};
