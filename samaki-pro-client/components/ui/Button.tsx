import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    fullWidth?: boolean;
    style?: any;
    testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
    style,
    testID,
}) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();

    const isSw = language === 'sw';

    const getHeight = () => {
        if (size === 'lg') return 56;
        if (size === 'sm') return 36;
        return 48;
    };

    const getColors = () => {
        if (disabled) {
            return {
                bg: colors.surfaceSunken,
                text: colors.inkMuted,
                border: colors.border,
            };
        }

        switch (variant) {
            case 'secondary':
                return {
                    bg: colors.surfaceCard,
                    text: colors.ink,
                    border: isSunMode ? colors.borderStrong : colors.border,
                };
            case 'destructive':
                return {
                    bg: isSunMode ? '#ffffff' : colors.criticalWash,
                    text: colors.critical,
                    border: colors.critical,
                };
            case 'ghost':
                return {
                    bg: 'transparent',
                    text: colors.primary,
                    border: 'transparent',
                };
            case 'primary':
            default:
                return {
                    bg: colors.primary,
                    text: colors.onPrimary,
                    border: isSunMode ? colors.borderStrong : colors.primary,
                };
        }
    };

    const c = getColors();
    const btnHeight = getHeight();

    return (
        <TouchableOpacity
            testID={testID}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.75}
            style={[
                styles.button,
                {
                    height: btnHeight,
                    backgroundColor: c.bg,
                    borderColor: c.border,
                    borderWidth: variant === 'ghost' ? 0 : (isSunMode ? 2 : 1),
                    borderRadius: radii.md,
                    paddingHorizontal: spacing.space4,
                    alignSelf: fullWidth ? 'stretch' : 'auto',
                },
                style
            ]}
        >
            {loading ? (
                <View style={styles.contentRow}>
                    <ActivityIndicator 
                        size="small" 
                        color={variant === 'primary' ? colors.onPrimary : colors.primary} 
                        style={{ marginRight: 8 }} 
                    />
                    <Text 
                        style={[
                            styles.text, 
                            { 
                                color: c.text, 
                                fontSize: size === 'lg' ? typography.subhead.fontSize : typography.label.fontSize 
                            }
                        ]}
                    >
                        {isSw ? 'Inatuma...' : 'Sending...'}
                    </Text>
                </View>
            ) : (
                <View style={styles.contentRow}>
                    {icon && (
                        <IconButton
                            icon={icon}
                            size={size === 'sm' ? 16 : 20}
                            iconColor={c.text}
                            style={{ margin: 0, marginRight: 4, padding: 0 }}
                        />
                    )}
                    <Text 
                        style={[
                            styles.text, 
                            { 
                                color: c.text, 
                                fontSize: size === 'lg' ? typography.subhead.fontSize : typography.label.fontSize 
                            }
                        ]}
                    >
                        {children}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '700',
        letterSpacing: 0.1,
    }
});

export default Button;
