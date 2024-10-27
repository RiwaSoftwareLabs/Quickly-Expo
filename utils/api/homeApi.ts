import { supabase } from "@/utils/api/apiClient";
import { getCache, setCache, isCacheValid } from "./cache";


const CACHE_KEY = "sectionsWithCategories";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface Category {
    id: string;
    section_id: string;
    category_title_en: string;
    category_title_ar: string;
    icon: string;
  }

interface Section {
  section_id: string;
  title_en: string;
  title_ar: string;
  status: boolean;
  created_at: string;
  categories: Category[];
}

export const fetchSectionsWithCategories = async (): Promise<Section[]> => {
  // Check if cache is valid
  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[Sections API] Fetching sections from cache");
    return await getCache(CACHE_KEY);
  }

  try {
    console.log("[Sections API] Fetching sections from Supabase");
    const { data, error } = await supabase.rpc('get_sections_with_categories');
    console.log("data", data);

    if (error) {
      throw new Error(`Error fetching sections with categories: ${error.message}`);
    }

    if (data && data.length > 0) {
      await setCache(CACHE_KEY, data);
      return data as Section[];
    } else {
      return await getCache(CACHE_KEY);
    }
  } catch (error) {
    console.error('Error in fetchSectionsWithCategories:', error);
    throw error;
  }
};
