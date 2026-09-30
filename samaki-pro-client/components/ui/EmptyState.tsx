import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: string;
    style?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    actionLabel,
    onAction,
    icon = 'clipboard-text-outline',
    style
}) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();

    const isSw = language === 'sw';

    return (
        <View 
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceCard,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1.5,
                    borderStyle: 'dashed',
                    borderRadius: radii.lg,
                    padding: spacing.space6,
                },
                style
            ]}
        >
            <View style={[styles.iconWrapper, { backgroundColor: colors.surfaceSunken }]}>
                <IconButton 
                    icon={icon} 
                    size={32} 
                    iconColor={colors.ink} 
                    style={{ margin: 0 }} 
                />
            </View>

            <Text 
                style={[
                    styles.title, 
                    { 
                        color: colors.ink, 
                        fontSize: typography.heading.fontSize,
                        marginTop: spacing.space3,
                    }
                ]}
            >
                {title || (isSw ? 'Hakuna vipimo bado' : 'No readings yet')}
            </Text>

            <Text 
                style={[
                    styles.desc, 
                    { 
                        color: colors.inkMuted, 
                        fontSize: typography.body.fontSize,
                        marginVertical: spacing.space2,
                    }
                ]}
            >
                {description || (isSw 
                    ? 'Rekodi kipimo cha kwanza cha kizimba hiki kuanza ufuatiliaji.' 
                    : 'Record the first reading for this cage to begin monitoring.')}
            </Text>

            {onAction && (
                <TouchableOpacity
                    onPress={onAction}
                    style={[
                        styles.ctaBtn,
                        {
                            backgroundColor: colors.primary,
                            borderRadius: radii.md,
                            marginTop: spacing.space3,
                            borderColor: isSunMode ? colors.borderStrong : 'transparent',
                            borderWidth: isSunMode ? 1 : 0,
                        }
                    ]}
                >
                    <IconButton 
                        icon="plus" 
                        size={18} 
                        iconColor={colors.onPrimary} 
                        style={{ margin: 0, marginRight: -4 }} 
                    />
                    <Text 
                        style={[
                            styles.ctaText, 
                            { 
                                color: colors.onPrimary, 
                                fontSize: typography.label.fontSize 
                            }
                        ]}
                    >
                        {actionLabel || (isSw ? 'Rekodi kipimo' : 'Record reading')}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: '700',
        textAlign: 'center',
    },
    desc: {
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 280,
    },
    ctaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 20,
    },
    ctaText: {
        fontWeight: '700',
        marginLeft: 4,
    }
});

export default EmptyState;
