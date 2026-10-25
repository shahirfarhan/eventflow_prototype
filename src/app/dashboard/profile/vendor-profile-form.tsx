// 'use client'

// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { toast } from 'sonner'

// const profileSchema = z.object({
//   businessName: z.string().min(2, 'Business name must be at least 2 characters'),
//   description: z.string().optional(),
//   category: z.string().min(2, 'Category is required'),
//   location: z.string().min(2, 'Location is required'),
// })

// type ProfileFormValues = z.infer<typeof profileSchema>

// interface ProfileFormProps {
//   initialData: {
//     businessName: string
//     description?: string | null
//     category: string
//     location: string
//   }
// }

// export default function ProfileForm({ initialData }: ProfileFormProps) {
//   const [isLoading, setIsLoading] = useState(false)
//   const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       businessName: initialData.businessName,
//       description: initialData.description || '',
//       category: initialData.category,
//       location: initialData.location,
//     }
//   })

//   const onSubmit = async (data: ProfileFormValues) => {
//     setIsLoading(true)
//     try {
//       const response = await fetch('/api/vendor/profile', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update profile')
//       }

//       toast.success('Profile updated successfully')
//     } catch (error) {
//       toast.error('Something went wrong')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Business Profile</CardTitle>
//         <CardDescription>
//           Manage your public business profile information.
//         </CardDescription>
//       </CardHeader>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="businessName">Business Name</Label>
//             <Input id="businessName" {...register('businessName')} />
//             {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="category">Category</Label>
//             <Input id="category" {...register('category')} placeholder="e.g. Photography, Catering" />
//             {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="location">Location</Label>
//             <Input id="location" {...register('location')} placeholder="e.g. New York, NY" />
//             {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea id="description" {...register('description')} placeholder="Describe your services..." />
//             {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button disabled={isLoading}>
//             {isLoading ? 'Saving...' : 'Save Changes'}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   )
// }

"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ImagePlus, Loader2, Trash2, Upload, X, MailWarning } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SOCIAL_PLATFORMS, type SocialKey } from "@/lib/social-links"
import { SocialIcon } from "@/components/social-links"

const MAX_GALLERY = 12
const MAX_FILE_MB = 5

type FormValues = {
  businessName: string
  category: string
  location: string
  description: string
  occasions: string
  phoneNumber: string
  website: string
  email: string
  imageUrl: string | null
  galleryImages: string[]
  socials: Record<SocialKey, string>
}

async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file")
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`Images must be smaller than ${MAX_FILE_MB} MB`)
  }
  const form = new FormData()
  form.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", body: form })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || "Failed to upload image")
  }
  const json = await res.json()
  if (!json?.url) throw new Error("Upload succeeded but no URL returned")
  return json.url as string
}

// Two columns when there's room, one on phones (no breakpoint classes, so old Safari is fine)
const twoCol: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
}
const field: React.CSSProperties = { display: "grid", gap: 8 }

export default function VendorProfileForm({
  initial,
  categories,
}: {
  initial: FormValues
  categories: string[]
}) {
  const router = useRouter()
  const [values, setValues] = useState<FormValues>(initial)
  const [savedEmail, setSavedEmail] = useState(initial.email)
  const [currentPassword, setCurrentPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [emailNotice, setEmailNotice] = useState<string | null>(null)

  const coverInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)

  const emailChanged =
    values.email.trim().toLowerCase() !== savedEmail.trim().toLowerCase()
  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initial),
    [values, initial]
  )
  const busy = saving || uploadingCover || uploadingGallery > 0

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const setSocial = (key: SocialKey, value: string) =>
    setValues((v) => ({ ...v, socials: { ...v.socials, [key]: value } }))

  async function onCoverChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setUploadingCover(true)
    try {
      set("imageUrl", await uploadImage(file))
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setUploadingCover(false)
    }
  }

  async function onGalleryChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const files: File[] = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (files.length === 0) return

    const room = MAX_GALLERY - values.galleryImages.length
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_GALLERY} gallery photos`)
      return
    }
    const batch = files.slice(0, room)
    if (files.length > room) toast.message(`Only the first ${room} photo(s) were added`)

    setUploadingGallery(batch.length)
    for (const file of batch) {
      try {
        const url = await uploadImage(file)
        setValues((v) => ({ ...v, galleryImages: [...v.galleryImages, url] }))
      } catch (err) {
        toast.error(`${file.name}: ${(err as Error).message}`)
      } finally {
        setUploadingGallery((n) => n - 1)
      }
    }
  }

  function removeGalleryImage(url: string) {
    setValues((v) => ({ ...v, galleryImages: v.galleryImages.filter((u) => u !== url) }))
  }

  function makeCover(url: string) {
    setValues((v) => ({
      ...v,
      imageUrl: url,
      galleryImages: [
        ...(v.imageUrl ? [v.imageUrl] : []),
        ...v.galleryImages.filter((u) => u !== url),
      ],
    }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (emailChanged && !currentPassword) {
      setError("Enter your current password to change your email")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          currentPassword: emailChanged ? currentPassword : undefined,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Could not save your profile")

      // Show the cleaned-up links the server saved (e.g. "@shop" → full link)
      const p = json.profile
      const next: FormValues = {
        businessName: p.businessName,
        category: p.category,
        location: p.location,
        description: p.description ?? "",
        occasions: p.occasions ?? "",
        phoneNumber: p.phoneNumber ?? "",
        email: json.emailChanged ? values.email.trim().toLowerCase() : savedEmail,
        imageUrl: p.imageUrl ?? null,
        galleryImages: p.galleryImages ?? [],
        website: p.website ?? "",
        socials: Object.fromEntries(
          SOCIAL_PLATFORMS.map((s) => [s.key, p[s.key] ?? ""])
        ) as Record<SocialKey, string>,
      }
      setValues(next)
      setCurrentPassword("")

      if (json.emailChanged) {
        setSavedEmail(next.email)
        setEmailNotice(
          json.emailSent
            ? `We sent a verification link to ${values.email}. You'll need to verify it before your next sign-in.`
            : `Your email was changed, but we couldn't send the verification link. Use "Resend" on the login page before signing in again.`
        )
      }

      toast.success("Profile saved")
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 24 }}>
      {/* ================= PHOTOS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>
            Your cover photo is shown at the top of your page and on vendor cards.
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: "grid", gap: 24 }}>
          {/* Cover */}
          <div>
            <div
              className="border border-dashed border-border bg-muted/40"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 7",
                borderRadius: 14,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {values.imageUrl ? (
                <img
                  src={values.imageUrl}
                  alt="Cover"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="text-sm text-muted-foreground" style={{ textAlign: "center" }}>
                  <ImagePlus style={{ width: 28, height: 28, margin: "0 auto 8px" }} />
                  No cover photo yet
                </div>
              )}
              {uploadingCover && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.35)",
                    color: "white",
                  }}
                >
                  <Loader2 className="animate-spin" style={{ width: 24, height: 24 }} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => coverInput.current?.click()}
                disabled={uploadingCover}
              >
                <Upload style={{ width: 16, height: 16, marginRight: 8 }} />
                {values.imageUrl ? "Change cover" : "Upload cover"}
              </Button>
              {values.imageUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => set("imageUrl", null)}
                  disabled={uploadingCover}
                >
                  <Trash2 style={{ width: 16, height: 16, marginRight: 8 }} />
                  Remove
                </Button>
              )}
              <input
                ref={coverInput}
                type="file"
                accept="image/*"
                hidden
                onChange={onCoverChosen}
              />
            </div>
          </div>

          {/* Gallery */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <Label>Gallery</Label>
              <span className="text-xs text-muted-foreground">
                {values.galleryImages.length}/{MAX_GALLERY}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 12,
              }}
            >
              {values.galleryImages.map((url) => (
                <div
                  key={url}
                  className="group border border-border"
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={url}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    aria-label="Remove photo"
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 28,
                      height: 28,
                      borderRadius: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => makeCover(url)}
                    style={{
                      position: "absolute",
                      left: 6,
                      bottom: 6,
                      padding: "3px 8px",
                      borderRadius: 9999,
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      fontSize: 11,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Set as cover
                  </button>
                </div>
              ))}

              {Array.from({ length: uploadingGallery }).map((_, i) => (
                <div
                  key={`up-${i}`}
                  className="border border-border bg-muted/40"
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Loader2 className="animate-spin text-muted-foreground" style={{ width: 20, height: 20 }} />
                </div>
              ))}

              {values.galleryImages.length + uploadingGallery < MAX_GALLERY && (
                <button
                  type="button"
                  onClick={() => galleryInput.current?.click()}
                  className="border border-dashed border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 13,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <ImagePlus style={{ width: 22, height: 22 }} />
                  Add photos
                </button>
              )}
            </div>
            <input
              ref={galleryInput}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onGalleryChosen}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================= BUSINESS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Business details</CardTitle>
        </CardHeader>
        <CardContent style={{ display: "grid", gap: 16 }}>
          <div style={twoCol}>
            <div style={field}>
              <Label htmlFor="businessName">Business name</Label>
              <Input
                id="businessName"
                value={values.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div style={field}>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                list="vendor-categories"
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. Photography"
                required
                maxLength={60}
              />
              <datalist id="vendor-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div style={twoCol}>
            <div style={field}>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={values.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Kuala Lumpur"
                required
                maxLength={120}
              />
            </div>
            <div style={field}>
              <Label htmlFor="occasions">Occasions</Label>
              <Input
                id="occasions"
                value={values.occasions}
                onChange={(e) => set("occasions", e.target.value)}
                placeholder="Weddings, Birthdays, Corporate"
                maxLength={400}
              />
            </div>
          </div>

          <div style={field}>
            <Label htmlFor="description">About your business</Label>
            <textarea
              id="description"
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              rows={6}
              maxLength={3000}
              placeholder="Tell planners what you offer and what makes you different."
              className="border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 border text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              style={{ width: "100%", borderRadius: 8, padding: "10px 12px", resize: "vertical", minHeight: 120 }}
            />
            <span className="text-xs text-muted-foreground" style={{ textAlign: "right" }}>
              {values.description.length}/3000
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ================= CONTACT ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Shown on your public page.</CardDescription>
        </CardHeader>
        <CardContent style={{ display: "grid", gap: 16 }}>
          <div style={twoCol}>
            <div style={field}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </div>
            <div style={field}>
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={values.phoneNumber}
                onChange={(e) => set("phoneNumber", e.target.value)}
                placeholder="+60 12-345 6789"
                maxLength={25}
              />
            </div>
          </div>

          {emailChanged && (
            <div
              className="border border-amber-200 bg-amber-50 text-amber-900"
              style={{ borderRadius: 10, padding: 14, display: "grid", gap: 10 }}
            >
              <p className="text-sm">
                This is also your sign-in email. We&apos;ll send a verification link to the new
                address, and you&apos;ll need to verify it before your next sign-in.
              </p>
              <div style={field}>
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
          )}

          {emailNotice && (
            <div
              className="border border-sky-200 bg-sky-50 text-sky-900 text-sm"
              style={{ borderRadius: 10, padding: 14, display: "flex", gap: 10 }}
            >
              <MailWarning style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
              <span>{emailNotice}</span>
            </div>
          )}

          <div style={field}>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={values.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="yourbusiness.com"
              maxLength={300}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================= SOCIAL ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Social media</CardTitle>
          <CardDescription>
            Paste a link or just your username. Planners can tap the logos on your page to visit
            you.
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: "grid", gap: 14 }}>
          {SOCIAL_PLATFORMS.map((p) => (
            <div key={p.key} style={field}>
              <Label htmlFor={`social-${p.key}`}>{p.label}</Label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    pointerEvents: "none",
                  }}
                >
                  <SocialIcon platform={p.key} size={16} />
                </span>
                <Input
                  id={`social-${p.key}`}
                  value={values.socials[p.key]}
                  onChange={(e) => setSocial(p.key, e.target.value)}
                  placeholder={p.placeholder}
                  maxLength={300}
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ================= SAVE BAR ================= */}
      <div
        className="border border-border bg-background/95 shadow-lg backdrop-blur"
        style={{
          position: "sticky",
          bottom: 16,
          zIndex: 20,
          borderRadius: 14,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span className={error ? "text-sm text-red-600" : "text-sm text-muted-foreground"}>
          {error ?? (dirty ? "You have unsaved changes" : "All changes saved")}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="button"
            variant="ghost"
            disabled={!dirty || busy}
            onClick={() => {
              setValues(initial)
              setCurrentPassword("")
              setError(null)
            }}
          >
            Discard
          </Button>
          <Button type="submit" disabled={!dirty || busy}>
            {saving && <Loader2 className="animate-spin" style={{ width: 16, height: 16, marginRight: 8 }} />}
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  )
}
