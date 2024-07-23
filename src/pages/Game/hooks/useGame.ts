import { useState } from 'react';
import { EMPTY, from, fromEvent, generate, interval, map, noop, scan, sequenceEqual, switchMap, take, tap } from 'rxjs';
import { random } from '../utils';

export default function useGame2({ cellNum, divRef, isStart }: { cellNum: number; divRef: React.MutableRefObject<null[] | HTMLDivElement[]>; isStart: boolean }) {
    const [title, setTitle] = useState('Memory Game');
    const setInfo = (text: string) => setTitle(text);

    const displayLevelChange = () => {
        divRef.current.forEach(div => {
            if (!div) return;
            div.style.background = 'gray';
        });
    };

    const checkIfGameOver$ = (randomSequence: number[]) => {
        return (userSequence: number[]) =>
            from(userSequence).pipe(
                sequenceEqual(from(randomSequence)),
                tap(match => (!match && userSequence.length === randomSequence.length ? setInfo('GAME OVER!') : noop))
            );
    };

    const takePlayerInput$ = (randomSequence: number[]) => {
        return () =>
            fromEvent(document, 'click').pipe(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                take(randomSequence.length),
                scan((acc: number[], curr: MouseEvent) => [...acc, parseInt((curr.target as HTMLDivElement)['id'])], []),
                switchMap(checkIfGameOver$(randomSequence)),
                switchMap(result => (result ? (displayLevelChange(), memoryGame$(randomSequence.length + 1)) : EMPTY))
            );
    };

    const showSequenceToMemorize$ = (memorySize: number) => {
        return (randomSequence: number[]) =>
            interval(1000).pipe(
                tap(i => setInfo(i === memorySize - 1 ? `YOUR TURN` : `${memorySize - i} elements`)),
                take(randomSequence.length),
                map(index => randomSequence[index]),
                tap(value => {
                    const div = divRef.current[value];
                    if (!div) return;
                    console.log(value);
                    div.style.background = 'lightgray';
                }),
                switchMap(takePlayerInput$(randomSequence))
            );
    };

    const memoryGame$ = (memorySize: number) => {
        return generate(
            1,
            x => x <= memorySize,
            x => x + 1
        ).pipe(
            scan((acc: number[], _: number): number[] => [...acc, random(cellNum) + 1], []),
            switchMap(showSequenceToMemorize$(memorySize))
        );
    };
    if (!isStart) {
        memoryGame$(2).subscribe();
        console.log('subscribe');
    }

    return { title };
}
