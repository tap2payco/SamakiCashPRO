import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';
import StatusBadge, { BadgeStatus } from './StatusBadge';

interface ListRowProps {
    title: string;
    subtitle: string;
    status?: BadgeStatus;
    statusLabel?: string;
    rightValue?: string;
    rightSubtext?: string;
    onPress?: () => void;
    style?: any;
}

export const ListRow: React.FC<ListRowProps> = ({
    title,
    subtitle,
    status,
    statusLabel,
    rightValue,
    rightSubtext,
    onPress,
    style
}) => {
    const { colors, typography, radii, spacing, isSunMode } = useAppTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceCard,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.md,
                    paddingHorizontal: spacing.space4,
                    paddingVertical: spacing.space3,
                },
                style
            ]}
        >
            <View style={styles.leftCol}>
                <Text 
                    style={[
                        styles.titleText, 
                        { color: colors.ink, fontSize: typography.subhead.fontSize }
                    ]}
                >
                    {title}
                </Text>
                <Text 
                    style={[
                        styles.subText, 
                        { color: colors.inkMuted, fontSize: typography.caption.fontSize }
                    ]}
                >
                    {subtitle}
                </Text>
            </View>

            <View style={styles.rightCol}>
                {status && (
                    <StatusBadge status={status} label={statusLabel} size="sm" />
                )}

                {rightValue && (
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text 
                            style={[
                                styles.rightValueText, 
                                { color: colors.ink, fontSize: typography.bodyStrong.fontSize }
                            ]}
                        >
                            {rightValue}
                        </Text>
                        {rightSubtext && (
                            <Text 
                                style={[
                                    styles.rightSubText, 
                                    { color: colors.inkMuted, fontSize: typography.caption.fontSize }
                                ]}
                            >
                                {rightSubtext}
                            </Text>
                        )}
                    </View>
                )}

                {onPress && (
                    <IconButton
                        icon="chevron-right"
                        size={20}
                        iconColor={colors.inkMuted}
                        style={{ margin: 0, padding: 0, marginLeft: 6 }}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 4,
        minHeight: 56,
    },
    leftCol: {
        flex: 1,
        justifyContent: 'center',
    },
    titleText: {
        fontWeight: '700',
        marginBottom: 2,
    },
    subText: {
        fontWeight: '500',
    },
    rightCol: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightValueText: {
        fontWeight: '800',
    },
    rightSubText: {
        fontWeight: '500',
        marginTop: 2,
    }
});

export default ListRow;
