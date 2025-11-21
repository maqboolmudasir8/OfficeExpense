import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ThemedButton from '../components/ThemedButton';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from '../theme';

const ThemeDemoScreen = () => {
    const theme = useTheme();
    const { colors } = theme;

    const handlePress = (message: string) => {
        console.log(`Button pressed: ${message}`);
    };

    return (
        <View style={[globalStyles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[globalStyles.headerTitle, { marginBottom: 24 }]}>
                    Theme Demo
                </Text>

                <View style={styles.section}>
                    <Text style={globalStyles.sectionHeader}>Button Variants</Text>
                    <ThemedButton
                        title="Primary Button"
                        onPress={() => handlePress('Primary')}
                        variant="primary"
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Secondary Button"
                        onPress={() => handlePress('Secondary')}
                        variant="secondary"
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Outlined Button"
                        onPress={() => handlePress('Outlined')}
                        variant="outlined"
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Text Button"
                        onPress={() => handlePress('Text')}
                        variant="text"
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Danger Button"
                        onPress={() => handlePress('Danger')}
                        variant="danger"
                        style={styles.button}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={globalStyles.sectionHeader}>Button Sizes</Text>
                    <ThemedButton
                        title="Small Button"
                        onPress={() => handlePress('Small')}
                        size="small"
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Medium Button"
                        onPress={() => handlePress('Medium')}
                        size="medium"
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Large Button"
                        onPress={() => handlePress('Large')}
                        size="large"
                        style={styles.button}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={globalStyles.sectionHeader}>With Icons</Text>
                    <ThemedButton
                        title="Add Item"
                        onPress={() => handlePress('Add Item')}
                        icon="add"
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Save"
                        onPress={() => handlePress('Save')}
                        icon="save"
                        variant="secondary"
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Delete"
                        onPress={() => handlePress('Delete')}
                        icon="delete"
                        variant="danger"
                        iconPosition="right"
                        style={styles.button}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={globalStyles.sectionHeader}>States</Text>
                    <ThemedButton
                        title="Loading Button"
                        onPress={() => handlePress('Loading')}
                        loading={true}
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Disabled Button"
                        onPress={() => handlePress('Disabled')}
                        disabled={true}
                        style={styles.button}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    button: {
        marginVertical: 8,
    },
});

export default ThemeDemoScreen;
