import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';

interface NumberStepperProps {
    label: string;
    value: number;
    unit?: string;
    step?: number;
    min?: number;
    max?: number;
    decimals?: number;
    onChange: (val: number) => void;
    helperText?: string;
    style?: any;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
    label,
    value,
    unit,
    step = 0.1,
    min = 0,
    max = 9999,
    decimals = 1,
    onChange,
    helperText,
    style
}) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [textInputVal, setTextInputVal] = useState(value.toFixed(decimals));

    const isSw = language === 'sw';
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const increment = () => {
        const nextVal = Math.min(max, Number((value + step).toFixed(decimals)));
        onChange(nextVal);
        setTextInputVal(nextVal.toFixed(decimals));
    };

    const decrement = () => {
        const nextVal = Math.max(min, Number((value - step).toFixed(decimals)));
        onChange(nextVal);
        setTextInputVal(nextVal.toFixed(decimals));
    };

    const handleTextSubmit = () => {
        setIsEditing(false);
        const parsed = parseFloat(textInputVal);
        if (!isNaN(parsed)) {
            const clamped = Math.max(min, Math.min(max, parsed));
            onChange(Number(clamped.toFixed(decimals)));
            setTextInputVal(clamped.toFixed(decimals));
        } else {
            setTextInputVal(value.toFixed(decimals));
        }
    };

    return (
        <View 
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceCard,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.md,
                    padding: spacing.space4,
                },
                style
            ]}
        >
            <Text style={[styles.label, { color: colors.ink, fontSize: typography.subhead.fontSize }]}>
                {label}
            </Text>

            <View style={[styles.stepperRow, { marginVertical: spacing.space3 }]}>
                {/* Decrement Button (48px touch target) */}
                <TouchableOpacity
                    onPress={decrement}
                    style={[
                        styles.stepBtn,
                        {
                            borderColor: isSunMode ? colors.borderStrong : colors.border,
                            borderWidth: isSunMode ? 2 : 1,
                            borderRadius: radii.md,
                            backgroundColor: colors.surfaceSunken,
                        }
                    ]}
                    accessibilityLabel="Decrease"
                >
                    <IconButton icon="minus" size={24} iconColor={colors.primary} style={{ margin: 0 }} />
                </TouchableOpacity>

                {/* Center Value */}
                <TouchableOpacity 
                    onPress={() => setIsEditing(true)}
                    style={styles.valueContainer}
                >
                    {isEditing ? (
                        <TextInput
                            value={textInputVal}
                            onChangeText={setTextInputVal}
                            onBlur={handleTextSubmit}
                            onSubmitEditing={handleTextSubmit}
                            keyboardType="numeric"
                            autoFocus
                            style={[
                                styles.textInput,
                                {
                                    color: colors.ink,
                                    borderColor: colors.focusRing,
                                    borderWidth: 2,
                                    borderRadius: radii.sm,
                                }
                            ]}
                        />
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[styles.valueText, { color: colors.ink, fontSize: typography.figureHero.fontSize }]}>
                                {value.toFixed(decimals)}
                            </Text>
                            {unit && (
                                <Text style={[styles.unitText, { color: colors.inkMuted, fontSize: typography.caption.fontSize }]}>
                                    {unit}
                                </Text>
                            )}
                        </View>
                    )}
                </TouchableOpacity>

                {/* Increment Button (48px touch target) */}
                <TouchableOpacity
                    onPress={increment}
                    style={[
                        styles.stepBtn,
                        {
                            borderColor: isSunMode ? colors.borderStrong : colors.border,
                            borderWidth: isSunMode ? 2 : 1,
                            borderRadius: radii.md,
                            backgroundColor: colors.surfaceSunken,
                        }
                    ]}
                    accessibilityLabel="Increase"
                >
                    <IconButton icon="plus" size={24} iconColor={colors.primary} style={{ margin: 0 }} />
                </TouchableOpacity>
            </View>

            <Text style={[styles.helper, { color: colors.inkMuted, fontSize: typography.caption.fontSize }]}>
                {helperText || (isSw 
                    ? 'Shikilia kitufe kurudia. Gusa nambari kuandika moja kwa moja.' 
                    : 'Hold a button to repeat. Tap the value to type instead.')}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        fontWeight: '700',
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stepBtn: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    valueText: {
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    unitText: {
        fontWeight: '600',
        marginTop: 2,
    },
    textInput: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
        minWidth: 100,
    },
    helper: {
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 16,
    }
});

export default NumberStepper;
