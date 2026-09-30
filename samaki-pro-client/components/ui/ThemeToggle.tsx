import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme, ThemeMode } from '~/theme';

interface ThemeToggleProps {
    variant?: 'header' | 'segmented';
    style?: any;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'header', style }) => {
    const { mode, setMode, colors, radii, isSunMode, language } = useAppTheme();

    const isSw = language === 'sw';

    if (variant === 'header') {
        return (
            <TouchableOpacity
                onPress={() => setMode(mode === 'sun' ? 'light' : 'sun')}
                style={[
                    styles.headerBtn,
                    {
                        borderColor: isSunMode ? colors.borderStrong : colors.border,
                        borderWidth: isSunMode ? 2 : 1,
                        borderRadius: radii.md,
                        backgroundColor: isSunMode ? colors.primary : colors.surfaceCard,
                    },
                    style
                ]}
                accessibilityLabel="Toggle Sun Mode for outdoor visibility"
            >
                <IconButton
                    icon="white-balance-sunny"
                    size={20}
                    iconColor={isSunMode ? colors.onPrimary : colors.ink}
                    style={{ margin: 0, padding: 0 }}
                />
            </TouchableOpacity>
        );
    }

    const options: { mode: ThemeMode; label: string; icon?: string }[] = [
        { mode: 'light', label: isSw ? 'Mwanga' : 'Light' },
        { mode: 'night', label: isSw ? 'Usiku' : 'Night' },
        { mode: 'sun', label: isSw ? '☼ Jua' : '☼ Sun' },
    ];

    return (
        <View style={style}>
            <View 
                style={[
                    styles.segmentedContainer,
                    {
                        backgroundColor: colors.surfaceSunken,
                        borderColor: isSunMode ? colors.borderStrong : colors.border,
                        borderWidth: isSunMode ? 2 : 1,
                        borderRadius: radii.md,
                    }
                ]}
            >
                {options.map((opt) => {
                    const isActive = mode === opt.mode;
                    return (
                        <TouchableOpacity
                            key={opt.mode}
                            onPress={() => setMode(opt.mode)}
                            style={[
                                styles.segmentOption,
                                {
                                    backgroundColor: isActive 
                                        ? (mode === 'sun' ? colors.primary : colors.surfaceCard)
                                        : 'transparent',
                                    borderRadius: radii.sm,
                                    borderColor: isActive && isSunMode ? colors.borderStrong : 'transparent',
                                    borderWidth: isActive && isSunMode ? 1 : 0,
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    {
                                        color: isActive
                                            ? (mode === 'sun' ? colors.onPrimary : colors.ink)
                                            : colors.inkMuted,
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
            <Text style={[styles.helpText, { color: colors.inkMuted }]}>
                {isSw
                    ? 'Hali ya Jua imeundwa kwa mwanga mkali wa Ziwa Victoria.'
                    : "Night follows dark setting. Sun is for bright light on the lake."}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmentedContainer: {
        flexDirection: 'row',
        padding: 4,
        alignSelf: 'stretch',
    },
    segmentOption: {
        flex: 1,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmentText: {
        fontSize: 14,
    },
    helpText: {
        fontSize: 12,
        marginTop: 6,
        lineHeight: 16,
    }
});

export default ThemeToggle;
