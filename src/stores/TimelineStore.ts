import { writable, derived } from 'svelte/store';

// Todo: Replace with UUID
const createId = () => Math.random().toString();

export interface ActionMarker {
	name: string;
	time: number;
	id: string;
}

interface MarkerDelta {
	sourceId: string;
	targetId: string;
	id: string;
}

interface MarkerDeltaView extends MarkerDelta {
	source: ActionMarker;
	target: ActionMarker;
	sourceIndex: number;
	targetIndex: number;
}

const markerStore = writable<Record<string, ActionMarker>>({});
const deltaStore = writable<Record<string, MarkerDelta>>({});

export const addMarker = (name: string, time: number) => {
	const id = createId();
	markerStore.update((m) => ({ ...m, [id]: { name, time, id } }));
};
export const editMarker = (marker: Partial<ActionMarker> & Pick<ActionMarker, 'id'>) => {
	markerStore.update((m) => ({ ...m, [marker.id]: { ...m[marker.id], ...marker } }));
};

export const addMarkerDelta = (sourceId: string, targetId: string) => {
	const id = createId();
	deltaStore.update((d) => ({ ...d, [id]: { sourceId, targetId, id } }));
};

const filterObject = <V>(
	object: Record<string, V>,
	predicate: (entry: [string, V], index: number) => any
): Record<string, V> =>
	Object.fromEntries(
		Object.entries(object).filter(([key, value], index) => predicate([key, value], index))
	);

export const deleteMarker = (idToDelete: string) => {
	deltaStore.update((d) =>
		filterObject(d, ([, delta]) => delta.sourceId !== idToDelete && delta.targetId !== idToDelete)
	);
	markerStore.update((m) => filterObject(m, ([id]) => id !== idToDelete));
};

export const deleteDelta = (idToDelete: string) =>
	deltaStore.update((d) => filterObject(d, ([id]) => id !== idToDelete));

export const markers = derived(markerStore, ($markerStore) => Object.values($markerStore));

export const deltas = derived([deltaStore, markerStore], ([$deltaStore, $markerStore]) => {
	const indexLookup = new Map(Object.keys($markerStore).map((id, index) => [id, index]));
	return Object.values($deltaStore).map(
		(delta): MarkerDeltaView => ({
			...delta,
			source: $markerStore[delta.sourceId],
			target: $markerStore[delta.targetId],
			sourceIndex: indexLookup.get(delta.sourceId)!,
			targetIndex: indexLookup.get(delta.targetId)!
		})
	);
});
