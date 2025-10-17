import appointmentsData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.appointments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  }

  async create(appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newAppointment = {
      ...appointmentData,
      Id: Math.max(...this.appointments.map(a => a.Id)) + 1,
      status: "scheduled",
      createdAt: new Date().toISOString()
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    this.appointments[index] = { ...this.appointments[index], ...appointmentData };
    return { ...this.appointments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    this.appointments.splice(index, 1);
    return true;
  }

  async getByDate(date) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.appointments.filter(appointment =>
      appointment.scheduledDate === date
    );
  }

  async getByPatient(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.appointments.filter(appointment =>
      appointment.patientId === parseInt(patientId)
    );
  }

  async getTodaysAppointments() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(appointment =>
      appointment.scheduledDate === today
    );
  }
}

export default new AppointmentService();