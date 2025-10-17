import doctorsData from "@/services/mockData/doctors.json";

class DoctorService {
  constructor() {
    this.doctors = [...doctorsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...this.doctors];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const doctor = this.doctors.find(d => d.Id === parseInt(id));
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return { ...doctor };
  }

  async create(doctorData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newDoctor = {
      ...doctorData,
      Id: Math.max(...this.doctors.map(d => d.Id)) + 1,
      currentPatients: []
    };
    this.doctors.push(newDoctor);
    return { ...newDoctor };
  }

  async update(id, doctorData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    this.doctors[index] = { ...this.doctors[index], ...doctorData };
    return { ...this.doctors[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    this.doctors.splice(index, 1);
    return true;
  }

  async getAvailableDoctors() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.doctors.filter(doctor => 
      doctor.currentPatients.length < 10 // Assuming max 10 patients per doctor
    );
  }
}

export default new DoctorService();