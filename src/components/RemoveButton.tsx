import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {RemoveSvg} from '../assets';
import {useAppDispatch} from '../redux/hooks/redux-hooks';
import {clearList} from '../redux/dataSlice';

type Props = {
  anchor: string;
};

export const RemoveButton: React.FC<Props> = ({anchor}) => {
  const dispatch = useAppDispatch();

  return (
    <TouchableOpacity onPress={() => dispatch(clearList(anchor))} style={S.btn}>
      <RemoveSvg />
    </TouchableOpacity>
  );
};

const S = StyleSheet.create({
  btn: {marginRight: 16},
});
