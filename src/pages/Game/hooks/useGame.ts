import { useEffect, useRef, useState } from 'react';
import { fromEvent, type Subscription } from 'rxjs';

export default function useGame({ cellNum }: { cellNum: number }) {
    const [divChange, setChange] = useState(false);
    const divRef = useRef<null[] | HTMLDivElement[]>(new Array(cellNum).fill(null));
    const changeDiv = () => setChange(prev => !prev);

    useEffect(() => {
        const subList: Subscription[] = [];
        divRef.current.forEach(el => {
            if (!el) return;

            const myObservable = fromEvent(el, 'click');
            const subscription = myObservable.subscribe({ next: event => console.log((event.target as HTMLDivElement).id) });
            subList.push(subscription);
        });

        return () => {
            subList.forEach(sub => sub.unsubscribe());
        };
    }, [divChange]);

    return { divRef, changeDiv };
}
