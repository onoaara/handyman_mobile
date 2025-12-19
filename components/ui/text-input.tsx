import { useState, forwardRef } from "react"
import { StyleSheet, TextInput, View, Pressable, TextInputProps } from "react-native"
import { ThemedText } from "@/components/themed-text"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { Colors } from "@/constants/theme"
import { IconSymbol } from "./icon-symbol"

type Props = {
  label?: string
  helper?: string
  error?: string
} & TextInputProps

export const AppTextInput = forwardRef<TextInput, Props>(function AppTextInput(
  { label, helper, error, secureTextEntry, style, ...rest },
  ref
) {
  const scheme = useColorScheme()
  const [secure, setSecure] = useState<boolean>(!!secureTextEntry)
  const tint = Colors[scheme ?? "light"].tint

  return (
    <View style={styles.container}>
      {label ? <ThemedText type="subtitle">{label}</ThemedText> : null}
      <View style={[styles.inputWrapper, { borderColor: error ? "#ff4d4f" : "#ccc" }]}>
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          secureTextEntry={secure}
          {...rest}
        />
        {secureTextEntry ? (
          <Pressable style={styles.icon} onPress={() => setSecure((s) => !s)}>
            <IconSymbol name={secure ? "eye.slash" : "eye"} size={22} color={tint} />
          </Pressable>
        ) : null}
      </View>
      {error ? <ThemedText style={[styles.msg, { color: "#ff4d4f" }]}>{error}</ThemedText> : null}
      {helper && !error ? <ThemedText style={[styles.msg]}>{helper}</ThemedText> : null}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: "relative",
  },
  input: {
    fontSize: 16,
    paddingRight: 32,
  },
  icon: {
    position: "absolute",
    right: 8,
    top: 10,
  },
  msg: {
    fontSize: 12,
  },
})
