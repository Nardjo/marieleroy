<script setup lang="ts">
  useHead({
    title: 'Coût de ne rien faire',
  })

  definePageMeta({
    layout: 'admin',
  })

  const route = useRoute()
  const router = useRouter()
  const { loading, fetchCostOfInaction, updateCostOfInaction } = useCostOfInaction()
  const { refreshCostOfInaction } = useRefreshPublicData()
  const toast = useToast()

  // Tabs
  const tabs = [
    { label: 'En-tête', value: 'header', icon: 'i-lucide-heading' },
    { label: 'Points de douleur', value: 'pain-points', icon: 'i-lucide-list' },
    { label: 'Message d\'alerte', value: 'warning', icon: 'i-lucide-alert-triangle' },
    { label: 'Solution', value: 'solution', icon: 'i-lucide-lightbulb' },
    { label: 'CTA', value: 'cta', icon: 'i-lucide-mouse-pointer-click' },
  ]
  const activeTab = ref((route.query.tab as string) || 'header')

  // Sync tab with URL
  watch(activeTab, newTab => {
    router.replace({ query: { ...route.query, tab: newTab } })
  })

  const form = reactive({
    badgeText: '',
    title: '',
    subtitle: '',
    painPoints: [] as string[],
    warningTitle: '',
    warningSubtitle: '',
    solutionText1: '',
    solutionText2: '',
    solutionHighlight: '',
    ctaTitle: '',
    ctaDescription: '',
    ctaButtonText: '',
    ctaButtonUrl: '',
    ctaUseDefaultUrl: true,
  })

  const loadContent = async () => {
    try {
      const data = await fetchCostOfInaction()
      Object.assign(form, {
        badgeText: data.badgeText || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        painPoints: Array.isArray(data.painPoints) ? data.painPoints : [],
        warningTitle: data.warningTitle || '',
        warningSubtitle: data.warningSubtitle || '',
        solutionText1: data.solutionText1 || '',
        solutionText2: data.solutionText2 || '',
        solutionHighlight: data.solutionHighlight || '',
        ctaTitle: data.ctaTitle || '',
        ctaDescription: data.ctaDescription || '',
        ctaButtonText: data.ctaButtonText || '',
        ctaButtonUrl: data.ctaButtonUrl || '',
        ctaUseDefaultUrl: data.ctaUseDefaultUrl ?? true,
      })
    } catch (err: any) {
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger la section',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  const saveContent = async () => {
    try {
      const filteredPainPoints = form.painPoints.filter(p => p && p.trim() !== '')

      const payload = {
        badgeText: form.badgeText || 'Coût de ne rien faire',
        title: form.title || 'Ce qui te coûte le plus cher aujourd\'hui…',
        subtitle: form.subtitle?.trim() || null,
        painPoints: filteredPainPoints,
        warningTitle: form.warningTitle?.trim() || null,
        warningSubtitle: form.warningSubtitle?.trim() || null,
        solutionText1: form.solutionText1?.trim() || null,
        solutionText2: form.solutionText2?.trim() || null,
        solutionHighlight: form.solutionHighlight?.trim() || null,
        ctaTitle: form.ctaTitle?.trim() || null,
        ctaDescription: form.ctaDescription?.trim() || null,
        ctaButtonText: form.ctaButtonText?.trim() || null,
        ctaButtonUrl: form.ctaButtonUrl?.trim() || null,
        ctaUseDefaultUrl: form.ctaUseDefaultUrl,
      }

      await updateCostOfInaction(payload)
      await refreshCostOfInaction()
      toast.add({
        title: 'Section enregistrée',
        description: 'La section "Coût de ne rien faire" a été mise à jour',
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || 'Impossible de sauvegarder la section',
        color: 'error',
        duration: 5000,
      })
    }
  }

  const addPainPoint = () => {
    form.painPoints.push('')
  }

  const removePainPoint = (index: number) => {
    form.painPoints.splice(index, 1)
  }

  onMounted(() => {
    loadContent()
  })
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="Coût de ne rien faire" description="Gérer le contenu de la section 'Coût de ne rien faire'">
      <template #actions>
        <UButton
          v-if="activeTab === 'pain-points'"
          color="neutral"
          size="lg"
          icon="i-lucide-plus"
          @click="addPainPoint">
          Ajouter un point
        </UButton>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveContent">
          Enregistrer
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Loading State -->
    <template v-if="loading">
      <UCard>
        <div class="space-y-4">
          <div v-for="i in 4" :key="i">
            <USkeleton class="h-4 w-24 mb-2" />
            <USkeleton class="h-10 w-full" />
          </div>
        </div>
      </UCard>
    </template>

    <!-- Content with Tabs -->
    <template v-else>
      <UTabs v-model="activeTab" :items="tabs" class="w-full">
        <template #content="{ item }">
          <!-- Header Tab -->
          <div v-if="item.value === 'header'" class="space-y-6 pt-6">
            <UCard>
              <div class="space-y-4">
                <UFormField label="Badge" hint="Texte affiché dans le badge orange">
                  <UInput v-model="form.badgeText" size="lg" placeholder="Coût de ne rien faire" />
                </UFormField>

                <UFormField label="Titre" required>
                  <UInput v-model="form.title" size="lg" placeholder="Ce qui te coûte le plus cher aujourd'hui…" />
                </UFormField>

                <UFormField label="Sous-titre" hint="Peut contenir du HTML (ex: <strong>, <br />)">
                  <AdminRichTextEditor v-model="form.subtitle" placeholder="Sous-titre de la section..." />
                </UFormField>
              </div>
            </UCard>
          </div>

          <!-- Pain Points Tab -->
          <div v-else-if="item.value === 'pain-points'" class="space-y-6 pt-6">
            <UCard>
              <AdminEmptyState
                v-if="form.painPoints.length === 0"
                icon="i-lucide-list"
                title="Aucun point de douleur"
                description="Ajoutez des points de douleur pour cette section"
                button-label="Ajouter un point"
                button-icon="i-lucide-plus"
                @action="addPainPoint" />

              <div v-else class="space-y-3">
                <div v-for="(point, index) in form.painPoints" :key="index" class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-500 w-6">{{ index + 1 }}.</span>
                  <UInput v-model="form.painPoints[index]" class="flex-1" :placeholder="`Point de douleur ${index + 1}`" />
                  <UButton color="error" variant="soft" size="sm" icon="i-lucide-trash" @click="removePainPoint(index)" />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Warning Tab -->
          <div v-else-if="item.value === 'warning'" class="space-y-6 pt-6">
            <UCard>
              <div class="space-y-4">
                <UFormField label="Titre de l'alerte" hint="Peut contenir du HTML">
                  <AdminRichTextEditor v-model="form.warningTitle" placeholder="Ne rien changer aujourd'hui = ..." />
                </UFormField>

                <UFormField label="Sous-titre de l'alerte">
                  <UInput v-model="form.warningSubtitle" size="lg" placeholder="Ton système actuel..." />
                </UFormField>
              </div>
            </UCard>
          </div>

          <!-- Solution Tab -->
          <div v-else-if="item.value === 'solution'" class="space-y-6 pt-6">
            <UCard>
              <div class="space-y-4">
                <UFormField label="Texte solution 1" hint="Peut contenir du HTML (<strong>)">
                  <AdminRichTextEditor v-model="form.solutionText1" placeholder="Avec ma méthode, tu récupères..." />
                </UFormField>

                <UFormField label="Texte solution 2">
                  <UInput v-model="form.solutionText2" size="lg" placeholder="… et tu casses enfin..." />
                </UFormField>

                <UFormField label="Phrase mise en avant" hint="Peut contenir du HTML (<span>)">
                  <AdminRichTextEditor
                    v-model="form.solutionHighlight"
                    placeholder="Pour un business qui tourne..." />
                </UFormField>
              </div>
            </UCard>
          </div>

          <!-- CTA Tab -->
          <div v-else-if="item.value === 'cta'" class="space-y-6 pt-6">
            <UCard>
              <div class="space-y-4">
                <UFormField label="Titre du CTA">
                  <UInput v-model="form.ctaTitle" size="lg" placeholder="Une question avant de te lancer ?" />
                </UFormField>

                <UFormField label="Description du CTA">
                  <UInput v-model="form.ctaDescription" size="lg" placeholder="N'hésite pas à me contacter..." />
                </UFormField>

                <UFormField label="Texte du bouton">
                  <UInput v-model="form.ctaButtonText" size="lg" placeholder="Envoyer un message" />
                </UFormField>

                <UFormField>
                  <UCheckbox v-model="form.ctaUseDefaultUrl" label="Utiliser le lien CTA par défaut (paramètres)" />
                </UFormField>

                <UFormField v-if="!form.ctaUseDefaultUrl" label="URL personnalisée" hint="Accepte les liens classiques ou mailto:email@exemple.com">
                  <UInput v-model="form.ctaButtonUrl" size="lg" placeholder="https://... ou mailto:contact@exemple.com" />
                </UFormField>
              </div>
            </UCard>
          </div>
        </template>
      </UTabs>
    </template>
  </div>
</template>
