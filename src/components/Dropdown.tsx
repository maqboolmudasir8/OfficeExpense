import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Menu, Text, useTheme, IconButton, Searchbar } from 'react-native-paper';
import { TextInput } from './TextInput';

export interface LabelValueModel {
    label: string;
    value: string;
    icon?: string;
}

interface DropdownProps {
    label?: string;
    placeholder?: string;
    options: LabelValueModel[];
    value?: string;
    onSelect: (value?: string) => void;
    style?: StyleProp<ViewStyle>;
    mode?: 'flat' | 'outlined';
    inputProps?: any;
    disabled?: boolean;
    error?: boolean | string;
    searchable?: boolean;
}

export const Dropdown = ({
    label,
    options,
    value,
    placeholder = "Select an option",
    onSelect,
    style,
    mode = 'outlined',
    inputProps = {},
    disabled = false,
    error = false,
    searchable = false,
}: DropdownProps) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<LabelValueModel[]>(options);

    useEffect(() => {
        if (searchQuery) {
            const filtered = options.filter(option =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [searchQuery, options]);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                    {label}
                </Text>
            )}

            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                    <TextInput
                        mode={mode}
                        value={selectedOption?.label || ''}
                        placeholder={placeholder}
                        disabled={disabled}
                        rightIcon={visible ? "menu-up" : "menu-down"}
                        onRightIconPress={() => !disabled && setVisible(true)}
                        // right={
                        //     <TextInput.Icon
                        //         icon={visible ? "menu-up" : "menu-down"}
                        //         onPress={() => !disabled && setVisible(true)}
                        //     />
                        // }
                        style={styles.input}
                        outlineStyle={[styles.inputOutline, error ? styles.errorOutline : {}]}
                        onPressIn={() => !disabled && setVisible(true)}
                        editable={false}
                        {...inputProps}
                    />
                }
                style={styles.menu}
                contentStyle={styles.menuContent}
            >
                {searchable && (
                    <Searchbar
                        placeholder="Search..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        inputStyle={styles.searchInput}
                    />
                )}
                {filteredOptions.map((option) => (
                    <Menu.Item
                        key={option.value}
                        onPress={() => {
                            onSelect(option.value);
                            setVisible(false);
                            setSearchQuery('');
                        }}
                        title={option.label}
                        titleStyle={styles.menuItemText}
                        style={[
                            styles.menuItem,
                            value === option.value && styles.selectedMenuItem
                        ]}
                        leadingIcon={option.icon}
                    />
                ))}
                {filteredOptions.length === 0 && (
                    <Text style={styles.noResults}>No results found</Text>
                )}
            </Menu>

            {error && typeof error === 'string' && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        width: '100%',
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'transparent',
    },
    inputOutline: {
        borderWidth: 1,
        borderRadius: 4,
    },
    errorOutline: {
        borderColor: '#B00020',
        borderWidth: 1,
    },
    menu: {
        marginTop: 8,
    },
    menuContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 8,
        maxHeight: 300,
    },
    menuItem: {
        borderRadius: 4,
        marginVertical: 2,
    },
    selectedMenuItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    menuItemText: {
        fontSize: 14,
    },
    searchBar: {
        margin: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        elevation: 0,
    },
    searchInput: {
        minHeight: 36,
    },
    noResults: {
        padding: 16,
        textAlign: 'center',
        color: '#666',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 12,
    },
});