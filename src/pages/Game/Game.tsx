import { useEffect, useRef, useState } from 'react';
import { Title } from './components';
import { useGame } from './hooks';

const cellNum = 9;
export default function Game() {
    const [isStart, setStart] = useState(false);
    const divRef = useRef<null[] | HTMLDivElement[]>(new Array(cellNum).fill(null));
    const { title } = useGame({ cellNum, divRef, isStart });

    useEffect(() => {
        if (isStart) return;
        setStart(true);
    }, [isStart]);

    return (
        <div className='w-full h-full grid place-items-center'>
            <Title name={title} />
            <div id='wrapper' className='grid grid-cols-3 w-[200px]'>
                {divRef.current.map((el, i) => {
                    return (
                        <div
                            ref={itself => (divRef.current[i] = itself)}
                            key={el + '-' + i}
                            id={i + ''}
                            onClick={e => {
                                (e.target as HTMLDivElement).style.background = 'lightgray';
                            }}
                            onTransitionEnd={e => {
                                (e.target as HTMLDivElement).style.background = 'white';
                            }}
                            className='m-2 w-8 h-8 p-2 border transition-all duration-300 ease-in'
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}
