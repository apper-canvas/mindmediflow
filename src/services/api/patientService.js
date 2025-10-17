import patientsData from "@/services/mockData/patients.json";

class PatientService {
  constructor() {
    this.patients = [...patientsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.patients];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const patient = this.patients.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error("Patient not found");
    }
    return { ...patient };
  }

  async create(patientData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newPatient = {
      ...patientData,
      Id: Math.max(...this.patients.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString(),
      currentStatus: "scheduled"
    };
    this.patients.push(newPatient);
    return { ...newPatient };
  }

  async update(id, patientData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    this.patients[index] = { ...this.patients[index], ...patientData };
    return { ...this.patients[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    this.patients.splice(index, 1);
    return true;
  }

  async updateStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    this.patients[index].currentStatus = status;
    return { ...this.patients[index] };
  }

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const lowerQuery = query.toLowerCase();
    return this.patients.filter(patient =>
      patient.firstName.toLowerCase().includes(lowerQuery) ||
      patient.lastName.toLowerCase().includes(lowerQuery) ||
      patient.phone.includes(query) ||
      patient.email.toLowerCase().includes(lowerQuery)
    );
  }
}

export default new PatientService();