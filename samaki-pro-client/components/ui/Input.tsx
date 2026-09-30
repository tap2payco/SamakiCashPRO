import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TextInputProps } from 'react-native';
import { useAppTheme } from '~/theme';

interface InputProps extends TextInputProps {
    label?: string;
    helperText?: string;
    errorMessage?: string;
    containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
    label,
    helperText,
    errorMessage,
    containerStyle,
    style,
    ...rest
}) => {
    const { colors, typography, radii, spacing, isSunMode } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);

    const hasError = Boolean(errorMessage);

    const getBorderColor = () => {
        if (hasError) return colors.critical;
        if (isFocused) return colors.focusRing;
        if (isSunMode) return colors.borderStrong;
        return colors.border;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text 
                    style={[
                        styles.label, 
                        { 
                            color: hasError ? colors.critical : colors.ink, 
                            fontSize: typography.label.fontSize,
                            marginBottom: spacing.space1,
                        }
                    ]}
                >
                    {label}
                </Text>
            )}

            <TextInput
                placeholderTextColor={colors.inkMuted}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surfaceCard,
                        borderColor: getBorderColor(),
                        borderWidth: isFocused || isSunMode ? 2 : 1,
                        borderRadius: radii.md,
                        color: colors.ink,
                        fontSize: typography.body.fontSize,
                        paddingHorizontal: spacing.space3,
                    },
                    style
                ]}
                {...rest}
            />

            {(errorMessage || helperText) && (
                <Text 
                    style={[
                        styles.helperText, 
                        { 
                            color: hasError ? colors.critical : colors.inkMuted, 
                            fontSize: typography.caption.fontSize,
                            marginTop: spacing.space1,
                        }
                    ]}
                >
                    {errorMessage || helperText}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 6,
    },
    label: {
        fontWeight: '600',
    },
    input: {
        height: 48,
    },
    helperText: {
        fontWeight: '500',
    }
});

export default Input;
