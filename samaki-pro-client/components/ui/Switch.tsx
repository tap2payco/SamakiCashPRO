import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '~/theme';

interface SwitchProps {
    value: boolean;
    onValueChange: (val: boolean) => void;
    label: string;
    sublabel?: string;
    disabled?: boolean;
    style?: any;
}

export const Switch: React.FC<SwitchProps> = ({
    value,
    onValueChange,
    label,
    sublabel,
    disabled = false,
    style
}) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();

    const isSw = language === 'sw';
    const stateLabel = value 
        ? (isSw ? 'Imewashwa' : 'On') 
        : (isSw ? 'Imezimwa' : 'Off');

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={() => onValueChange(!value)}
            activeOpacity={0.8}
            style={[
                styles.container,
                {
                    paddingVertical: spacing.space3,
                },
                style
            ]}
        >
            <View style={styles.leftCol}>
                <Text style={[styles.label, { color: colors.ink, fontSize: typography.subhead.fontSize }]}>
                    {label}
                </Text>
                {sublabel && (
                    <Text style={[styles.sublabel, { color: colors.inkMuted, fontSize: typography.caption.fontSize }]}>
                        {sublabel}
                    </Text>
                )}
            </View>

            <View style={styles.rightCol}>
                {/* Switch Track */}
                <View 
                    style={[
                        styles.track,
                        {
                            backgroundColor: value ? colors.primary : colors.surfaceSunken,
                            borderColor: isSunMode ? colors.borderStrong : (value ? colors.primary : colors.border),
                            borderWidth: isSunMode ? 2 : 1,
                            borderRadius: radii.pill,
                            justifyContent: value ? 'flex-end' : 'flex-start',
                        }
                    ]}
                >
                    <View 
                        style={[
                            styles.thumb,
                            {
                                backgroundColor: value ? colors.onPrimary : colors.inkMuted,
                                borderRadius: radii.pill,
                            }
                        ]} 
                    />
                </View>

                {/* State text */}
                <Text style={[styles.stateText, { color: colors.inkMuted, fontSize: typography.label.fontSize, marginLeft: spacing.space2 }]}>
                    {stateLabel}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    leftCol: {
        flex: 1,
    },
    label: {
        fontWeight: '700',
    },
    sublabel: {
        fontWeight: '400',
        marginTop: 2,
    },
    rightCol: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    track: {
        width: 48,
        height: 28,
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumb: {
        width: 20,
        height: 20,
    },
    stateText: {
        fontWeight: '600',
        minWidth: 26,
    }
});

export default Switch;
