import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '~/theme';

interface SegmentOption {
    value: string;
    label: string;
    icon?: string;
}

interface SegmentedControlProps {
    options: SegmentOption[];
    selectedValue: string;
    onSelect: (val: string) => void;
    style?: any;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
    options,
    selectedValue,
    onSelect,
    style
}) => {
    const { colors, typography, radii, isSunMode } = useAppTheme();

    return (
        <View 
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceSunken,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.md,
                },
                style
            ]}
        >
            {options.map((opt) => {
                const isActive = selectedValue === opt.value;
                return (
                    <TouchableOpacity
                        key={opt.value}
                        onPress={() => onSelect(opt.value)}
                        style={[
                            styles.option,
                            {
                                backgroundColor: isActive 
                                    ? (isSunMode ? colors.primary : colors.surfaceCard)
                                    : 'transparent',
                                borderRadius: radii.sm,
                                borderColor: isActive && isSunMode ? colors.borderStrong : 'transparent',
                                borderWidth: isActive && isSunMode ? 1 : 0,
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                {
                                    color: isActive
                                        ? (isSunMode ? colors.onPrimary : colors.ink)
                                        : colors.inkMuted,
                                    fontSize: typography.label.fontSize,
                                    fontWeight: isActive ? '700' : '500',
                                }
                            ]}
                        >
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 4,
        alignSelf: 'stretch',
    },
    option: {
        flex: 1,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        textAlign: 'center',
    }
});

export default SegmentedControl;
