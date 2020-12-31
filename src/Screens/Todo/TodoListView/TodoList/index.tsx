import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import Styled from 'styled-components/native';

import { TodoListContext } from '~/Context/TodoListContext';

import EmptyItem from './EmptyItem';
import TodoItem from './TodoItem';

const Container = Styled(FlatList)`
`;
interface Props {}

const TodoList = ({  }: Props) => {
    const { todoList, removeTodoList } = useContext<ITodoListContext>(
      TodoListContext
    );
    return (
        <Container
            // 리스트 뷰에 표시할 데이터의 배열
            data={todoList}
            // 리액트에서 반복적으로 동일한 컴포넌트를 표시하기 위해서 컴포넌트에 키 값을 설정.
            // keyExtractor는 FlatList에서 반복적으로 표시하는 Item에 키 값을 설정하기 위한 Props이다.
            keyExtractor={(item, index) => {
                return `todo-${index}`;
              }}
            // 주어진 배열에 데이터가 없을 경우 표시되는 컴포넌트
            ListEmptyComponent={<EmptyItem />}
            // 주어진 배열에 데이터를 사용하여 반복적으로 표시될 컴포넌트
            renderItem={({ item, index }) => (
                <TodoItem
                  text={item as string}
                  onDelete={() => removeTodoList(index)}
                />
              )}
            // ListEmptyComponent도 하나의 리스트 아이템으로 표시되기 때문에 전체 화면으로 표시되지 않는다. 이 컴포넌트를 전체 화면으로 표시하기 위해서 flex 값을 줌
            contentContainerStyle={todoList.length === 0 && { flex: 1 }}
            />
          );
        };

export default TodoList;