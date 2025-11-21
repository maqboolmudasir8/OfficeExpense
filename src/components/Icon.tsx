// src/components/Icon.tsx
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconProps } from 'react-native-vector-icons/Icon';

interface Props extends IconProps {
    name: string;
    size?: number;
    color?: string;
}

export const Icon: React.FC<Props> = ({ name, size = 24, color = '#000', ...rest }) => {
    return <MaterialIcons name={name} size={size} color={color} {...rest} />;
};
