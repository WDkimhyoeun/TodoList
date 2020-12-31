import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

interface Props {
  children: JSX.Element | Array<JSX.Element>;
}

// @types/index.d.ts에 정의한 타입을 사용하여, Context의 데이터 타입을 지정함.
const TodoListContext = createContext<ITodoListContext>({
    // 지금은 빈 배열이고, 실제 구현은 Context의 프로바이더 컴포넌트에서 진행됨.
    todoList: [],
    addTodoList: (todo: string): void => {},
    removeTodoList: (index: number): void => {},
  });

// Context를 사용하기 위해서는 우선 공통 부모 컴포넌트에서 Context의 프로바이더를 사용한다.
// 공통 부모 컴포넌트에서 프로바이더를 사용하기 위해서는 Context의 프로바이더 컴포넌트를 만들고 공통 부모 컴포넌트의 부모 컴포넌트로서 사용한다.
//TodoListContextProvider는 공통 부모 컴포넌트의 부모 컴포넌트가 될 예정이다. 따라서 자식 컴포넌트를 children 매개 변수를 통해 전달받는다.
const TodoListContextProvider = ({children}: Props) => {
    const [todoList, setTodoList] = useState<Array<string>>([]);

    const addTodoList = (todo: string): void => {
        // 새로운 list 변수를 생성하여 todoList의 모든 데이터를 넣는다. 매개변수로 전달받는 건 todo
        const list = [...todoList, todo];
        setTodoList(list);
        // setItem을 사용하여 데이터를 물리적으로 저장한다.
        // setItem은 키 값 형태로 데이터를 저장하므로, JSON.stringfy를 사용하여 문자열로 변환한다.
        AsyncStorage.setItem('todoList', JSON.stringify(list));
    };

    const removeTodoList = (index: number): void => {
        let list = [...todoList];
        list.splice(index, 1);
        setTodoList(list);
        AsyncStorage.setItem('todoList', JSON.stringify(list));
      };


    // 앱이 시작될 때, AsyncStorage에 저장된 데이터를 불러와, Context의 값을 초기화하기 위한 함수이다.
    const initData = async () => {
        try {
            // AsyncStorage의 setItem과 getItem은 모두 Promise 함수이다. setITem을 한 후, 특정한 작업을 하지 않았기 때문에 비동기로 데이터를 처리.
            // 여기에서는 값을 바로 초기화하기 위해 async-await를 사용하여 동기화 처리함.
            const list = await AsyncStorage.getItem('todoList');
            if (list !== null) {
                // AsyncStorage에 저장된 값은 문자열이므로 이 데이터를 JSON.parse 함수를 사용하여 문자열 배열로 변경.
                setTodoList(JSON.parse(list));
            }
        } catch (e) {
            console.log(e);
          }
        };

    useEffect(() => {
        initData();
      }, []);

    return (
        <TodoListContext.Provider
          value={{
            todoList,
            addTodoList,
            removeTodoList,
          }}>
          {children}
        </TodoListContext.Provider>
      );
    };

// Context를 제공하기 위해 프로바이더 컴포넌트와 Context를 내보냄.
export {TodoListContextProvider, TodoListContext};