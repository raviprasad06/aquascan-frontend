export interface ApiDetection {
  class: string;
  confidence: number;
  risk: string;
}

export interface ApiPredictResponse {
  success: boolean;
  filename: string;
  detections: ApiDetection[];
  count: number;
  annotated_image?: string | null;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function analyzeSonarImage(file: File): Promise<ApiPredictResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Backend error (${response.status}): ${errorText || response.statusText}`);
    }

    const data: ApiPredictResponse = await response.json();
    return data;
  } catch (error: any) {
    if (error.message && error.message.includes('Backend error')) {
      throw error;
    }
    throw new Error('Unable to connect to AquaScan AI backend. Make sure FastAPI is running on port 8000.');
  }
}
