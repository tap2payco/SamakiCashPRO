import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';

interface OfflineBannerProps {
    isOnline?: boolean;
    pendingCount?: number;
    style?: any;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
    isOnline = false,
    pendingCount = 3,
    style
}) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();

    const isSw = language === 'sw';

    if (isOnline) {
        return (
            <View 
                style={[
                    styles.container,
                    {
                        backgroundColor: isSunMode ? '#ffffff' : colors.okWash,
                        borderColor: isSunMode ? colors.ok : colors.okFill,
                        borderWidth: isSunMode ? 2 : 1,
                        borderRadius: radii.md,
                        padding: spacing.space3,
                    },
                    style
                ]}
            >
                <IconButton 
                    icon="wifi" 
                    size={22} 
                    iconColor={colors.ok} 
                    style={styles.iconStyle} 
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.ok, fontSize: typography.subhead.fontSize }]}>
                        {isSw ? 'Mtandao umerudi' : 'Back online'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.ok, fontSize: typography.caption.fontSize }]}>
                        {isSw ? `Inatuma kumbukumbu ${pendingCount}.` : `Sending ${pendingCount} records.`}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View 
            style={[
                styles.container,
                {
                    backgroundColor: isSunMode ? '#ffffff' : colors.offlineBg,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.md,
                    padding: spacing.space3,
                },
                style
            ]}
        >
            <IconButton 
                icon="wifi-off" 
                size={22} 
                iconColor={colors.ink} 
                style={styles.iconStyle} 
            />
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.ink, fontSize: typography.subhead.fontSize }]}>
                    {isSw ? 'Uko nje ya mtandao' : 'You are offline'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.inkMuted, fontSize: typography.caption.fontSize }]}>
                    {isSw 
                        ? 'Kila unachoingiza kinahifadhiwa kwenye simu na kitatumwa mtandao ukipatikana.' 
                        : 'Everything you enter is kept on this phone and sent when there is signal.'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    iconStyle: {
        margin: 0,
        marginRight: 10,
        padding: 0,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: '700',
        marginBottom: 2,
    },
    subtitle: {
        fontWeight: '400',
        lineHeight: 18,
    }
});

export default OfflineBanner;
