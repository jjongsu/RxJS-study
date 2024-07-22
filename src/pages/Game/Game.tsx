import { Title } from './components';
import useGame from './hooks/useGame';

export default function Game() {
    const { divRef } = useGame({ cellNum: 9 });

    return (
        <div>
            <Title name='memory game' />
            <div className='grid grid-cols-3 w-[200px]'>
                {divRef.current.map((el, i) => {
                    return <div ref={itself => (divRef.current[i] = itself)} key={el + '-' + i} id={i + ''} className='m-2 w-8 h-8 p-2 border'></div>;
                })}
            </div>
        </div>
    );
}
