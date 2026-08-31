export async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const response = await fetch("https://clipdrop-api.co/v1/remove-background", {
    method: "POST",
    headers: {
      "x-api-key": process.env.CLIPDROP_API_KEY!,
    },
    body: new Uint8Array(imageBuffer),
  })

  if (!response.ok) {
    throw new Error(`Clipdrop API failed: ${response.status} ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
