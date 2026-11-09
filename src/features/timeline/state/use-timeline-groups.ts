import { useEffect, useState } from 'react';

import type { TimelineEvent, TimelineGroup } from '../shared/types';
import { groupEventsByDayAsync } from '../shared/utils';

const EMPTY: TimelineGroup[] = [];

type GroupingResult = {
    groups: TimelineGroup[];
    source: TimelineEvent[] | null; // the events array these groups were computed from
};

export function useTimelineGroups(events: TimelineEvent[]) {
    const [result, setResult] = useState<GroupingResult>({ groups: EMPTY, source: null });

    useEffect(() => {
        let cancelled = false;
        groupEventsByDayAsync(events, () => cancelled).then((groups) => {
            if (!cancelled) setResult({ groups, source: events });
        });
        return () => {
            cancelled = true;
        };
    }, [events]);

    return { groups: result.groups, isPending: result.source !== events };
}
